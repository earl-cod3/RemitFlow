import { Controller, Get, Post } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  // GET /currencies
  @Get()
  async findAll() {
    return this.currenciesService.findAll();
  }

  // POST /currencies/seed
  @Post('seed')
  async seed() {
    return this.currenciesService.seedDefaults();
  }
}
