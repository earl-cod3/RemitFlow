import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type ComplianceStatusType = 'PASS' | 'REVIEW' | 'REJECT';

export interface ComplianceInput {
  senderId: string;
  amount: number;
  fromCurrency: string;
  toCurrency: string;
}

export interface ComplianceResult {
  status: ComplianceStatusType;
  score: number; // 0 - 100
  reasons: string[];
}

@Injectable()
export class ComplianceService {
  constructor(private prisma: PrismaService) {}

  private getStartOfToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  async evaluateTransfer(input: ComplianceInput): Promise<ComplianceResult> {
    const { senderId, amount, fromCurrency, toCurrency } = input;

    const reasons: string[] = [];
    let score = 100;
    let status: ComplianceStatusType = 'PASS';

    // Rule 1: high-value single transfer
    if (amount > 50_000) {
      score -= 40;
      status = 'REVIEW';
      reasons.push('High-value transfer above 50,000 threshold');
    }

    // Rule 2: daily volume
    const startOfToday = this.getStartOfToday();

    const todayTotal = await this.prisma.transfer.aggregate({
      where: {
        senderId,
        createdAt: {
          gte: startOfToday,
        },
      },
      _sum: {
        fromAmount: true,
      },
    });

    const totalToday = Number(todayTotal._sum.fromAmount ?? 0);

    if (totalToday + amount > 100_000) {
      score -= 30;
      status = 'REVIEW';
      reasons.push('Daily sending limit exceeded (100,000)');
    }

    // Rule 3: “risky corridor” demo rule
    const corridor = `${fromCurrency}->${toCurrency}`;
    const riskyCorridors = ['ZAR->KES'];
    if (riskyCorridors.includes(corridor)) {
      score -= 10;
      reasons.push(`Corridor ${corridor} marked as higher risk (demo rule)`);
    }

    if (score <= 40) {
      status = 'REJECT';
      reasons.push('Overall risk score too low, rejecting transfer');
    }

    return {
      status,
      score,
      reasons,
    };
  }
}
