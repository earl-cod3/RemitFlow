import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // Returns all users from the DB
    return this.prisma.user.findMany();
  }

  async createDemoUsers() {
    // idempotent demo seeding
    const existing = await this.prisma.user.findMany();
    if (existing.length > 0) {
      return existing;
    }

    const alice = await this.prisma.user.create({
      data: {
        email: 'alice@example.com',
        name: 'Alice SA',
      },
    });

    const brian = await this.prisma.user.create({
      data: {
        email: 'brian@example.com',
        name: 'Brian Kenya',
      },
    });

    return [alice, brian];
  }
}
