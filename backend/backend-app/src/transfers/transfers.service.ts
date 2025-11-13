import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FxService } from '../fx/fx.service';
import { ComplianceService } from '../compliance/compliance.service';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Injectable()
export class TransfersService {
  constructor(
    private prisma: PrismaService,
    private fxService: FxService,
    private complianceService: ComplianceService,
  ) {}

  // ✅ List transfers with sender, recipient + wallets & currencies
  async findAll() {
    return this.prisma.transfer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        sender: true,
        recipient: true,
        fromWallet: {
          include: { currency: true },
        },
        toWallet: {
          include: { currency: true },
        },
      },
    });
  }

  // ✅ Single transfer (detail view)
  async findOne(id: string) {
    const transfer = await this.prisma.transfer.findUnique({
      where: { id },
      include: {
        sender: true,
        recipient: true,
        fromWallet: { include: { currency: true } },
        toWallet: { include: { currency: true } },
      },
    });

    if (!transfer) {
      throw new NotFoundException('Transfer not found');
    }

    return transfer;
  }

  async create(dto: CreateTransferDto) {
    const { senderId, recipientId, fromCurrency, toCurrency } = dto;
    const amount = Number(dto.amount);

    if (!senderId || !recipientId) {
      throw new BadRequestException('senderId and recipientId are required');
    }

    if (!fromCurrency || !toCurrency) {
      throw new BadRequestException('fromCurrency and toCurrency are required');
    }

    if (!amount || amount <= 0) {
      throw new BadRequestException('amount must be a positive number');
    }

    if (senderId === recipientId) {
      throw new BadRequestException('Sender and recipient must be different');
    }

    // 1) FX quote
    const quote = await this.fxService.quote({
      from: fromCurrency.toUpperCase(),
      to: toCurrency.toUpperCase(),
      amount,
    });

    // 2) Compliance check
    const compliance = await this.complianceService.evaluateTransfer({
      senderId,
      amount,
      fromCurrency: quote.from,
      toCurrency: quote.to,
    });

    if (compliance.status === 'REJECT') {
      throw new BadRequestException({
        message: 'Transfer rejected by compliance',
        reasons: compliance.reasons,
      });
    }

    // 3) DB transaction: create transfer + update balances
    const result = await this.prisma.$transaction(async (tx) => {
      // Make sure users exist
      const sender = await tx.user.findUnique({ where: { id: senderId } });
      const recipient = await tx.user.findUnique({
        where: { id: recipientId },
      });

      if (!sender || !recipient) {
        throw new NotFoundException('Sender or recipient not found');
      }

      // Sender wallet in fromCurrency
      const fromWallet = await tx.wallet.findFirst({
        where: {
          userId: senderId,
          currencyCode: quote.from,
        },
      });

      if (!fromWallet) {
        throw new BadRequestException(
          `Sender has no wallet in currency ${quote.from}`,
        );
      }

      // Recipient wallet in toCurrency (create if missing)
      let toWallet = await tx.wallet.findFirst({
        where: {
          userId: recipientId,
          currencyCode: quote.to,
        },
      });

      if (!toWallet) {
        toWallet = await tx.wallet.create({
          data: {
            userId: recipientId,
            currencyCode: quote.to,
            balance: 0,
          },
        });
      }

      // Check balance
      if (Number(fromWallet.balance) < quote.totalDebit) {
        throw new BadRequestException('Insufficient balance for this transfer');
      }

      // Simple reference
      const reference = `RF-${Date.now()}`;

      // Create transfer with PENDING
      const transfer = await tx.transfer.create({
        data: {
          reference,
          senderId,
          recipientId,
          fromWalletId: fromWallet.id,
          toWalletId: toWallet.id,
          fromAmount: amount,
          toAmount: quote.convertedAmount,
          fxRateUsed: quote.rate,
          feeAmount: quote.fee,
          status: 'PENDING', // enum value as string
          complianceStatus: compliance.status, // 'PASS' | 'REVIEW'
          complianceScore: compliance.score,
        },
      });

      // Debit sender
      await tx.wallet.update({
        where: { id: fromWallet.id },
        data: {
          balance: Number(fromWallet.balance) - quote.totalDebit,
        },
      });

      // Credit recipient
      await tx.wallet.update({
        where: { id: toWallet.id },
        data: {
          balance: Number(toWallet.balance) + quote.convertedAmount,
        },
      });

      // Mark COMPLETED
      const completed = await tx.transfer.update({
        where: { id: transfer.id },
        data: { status: 'COMPLETED' },
        include: {
          sender: true,
          recipient: true,
          fromWallet: { include: { currency: true } },
          toWallet: { include: { currency: true } },
        },
      });

      return {
        transfer: completed,
        fx: quote,
        compliance,
      };
    });

    return result;
  }
}
