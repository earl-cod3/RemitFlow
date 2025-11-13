import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FxService {
  constructor(private prisma: PrismaService) {}

  async getLatestRate(from: string, to: string) {
    const rate = await this.prisma.fxRate.findFirst({
      where: {
        baseCurrency: from,
        quoteCurrency: to,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!rate) {
      throw new NotFoundException(
        `No FX rate found for ${from} -> ${to}. Seed /fx/seed first.`,
      );
    }

    return rate;
  }

  async quote(params: { from: string; to: string; amount: number }) {
    const { from, to, amount } = params;
    const rate = await this.getLatestRate(from, to);

    const convertedAmount = amount * Number(rate.rate);
    const fee = amount * 0.01; // 1% fee (simple rule)
    const totalDebit = amount + fee;

    return {
      from,
      to,
      amount,
      rate: Number(rate.rate),
      convertedAmount,
      fee,
      totalDebit,
    };
  }

  async seedDefaultRate() {
    const existing = await this.prisma.fxRate.findMany();
    if (existing.length > 0) {
      return existing;
    }

    const rate = await this.prisma.fxRate.create({
      data: {
        baseCurrency: 'ZAR',
        quoteCurrency: 'KES',
        rate: 7.8, // 1 ZAR = 7.8 KES (example)
      },
    });

    return [rate];
  }
}
