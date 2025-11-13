import { Controller, Get, Param, Post } from '@nestjs/common';
import { WalletsService } from './wallets.service';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  // GET /wallets/user/:userId
  @Get('user/:userId')
  async getByUser(@Param('userId') userId: string) {
    return this.walletsService.findByUser(userId);
  }

  // POST /wallets/seed
  @Post('seed')
  async seed() {
    return this.walletsService.seedDemoWallets();
  }
}
