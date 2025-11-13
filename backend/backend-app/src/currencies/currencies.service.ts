import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CurrenciesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.currency.findMany();
  }

  async create(data: { code: string; name: string; symbol: string }) {
    return this.prisma.currency.create({ data });
  }

  async seedDefaults() {
    const existing = await this.prisma.currency.findMany();
    if (existing.length > 0) {
      return existing;
    }

    const zar = await this.prisma.currency.create({
      data: {
        code: 'ZAR',
        name: 'South African Rand',
        symbol: 'R',
      },
    });

    const kes = await this.prisma.currency.create({
      data: {
        code: 'KES',
        name: 'Kenyan Shilling',
        symbol: 'KSh',
      },
    });

    return [zar, kes];
  }
}
