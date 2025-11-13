import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.wallet.findMany({
      where: { userId },
      include: { currency: true },
    });
  }

  async createWallet(params: {
    userId: string;
    currencyCode: string;
    initialBalance?: number;
  }) {
    const { userId, currencyCode, initialBalance = 0 } = params;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const currency = await this.prisma.currency.findUnique({
      where: { code: currencyCode },
    });
    if (!currency) throw new NotFoundException('Currency not found');

    return this.prisma.wallet.create({
      data: {
        userId,
        currencyCode,
        balance: initialBalance,
      },
    });
  }

  async seedDemoWallets() {
    const existing = await this.prisma.wallet.findMany();
    if (existing.length > 0) return existing;

    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });

    if (users.length < 2) {
      throw new Error(
        'Need at least 2 users to seed demo wallets. Seed /users/seed first.',
      );
    }

    const alice = users[0];
    const brian = users[1];

    const zar = await this.prisma.currency.findUnique({
      where: { code: 'ZAR' },
    });
    const kes = await this.prisma.currency.findUnique({
      where: { code: 'KES' },
    });

    if (!zar || !kes) {
      throw new Error(
        'ZAR and KES currencies must exist. Seed /currencies/seed first.',
      );
    }

    const aliceZarWallet = await this.prisma.wallet.create({
      data: {
        userId: alice.id,
        currencyCode: zar.code,
        balance: 10_000, // Alice starts with 10,000 ZAR
      },
    });

    const brianKesWallet = await this.prisma.wallet.create({
      data: {
        userId: brian.id,
        currencyCode: kes.code,
        balance: 0, // Brian starts with 0 KES
      },
    });

    return [aliceZarWallet, brianKesWallet];
  }
}
