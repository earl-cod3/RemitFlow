import { Controller, Get, Post, Query } from '@nestjs/common';
import { FxService } from './fx.service';

@Controller('fx')
export class FxController {
  constructor(private readonly fxService: FxService) {}

  // GET /fx/quote?from=ZAR&to=KES&amount=500
  @Get('quote')
  async quote(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('amount') amount: string,
  ) {
    const numericAmount = Number(amount);
    if (!from || !to || isNaN(numericAmount)) {
      return {
        error:
          'Missing or invalid query params. Expected: from, to, amount (number)',
      };
    }

    return this.fxService.quote({
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      amount: numericAmount,
    });
  }

  // POST /fx/seed
  @Post('seed')
  async seed() {
    return this.fxService.seedDefaultRate();
  }
}
