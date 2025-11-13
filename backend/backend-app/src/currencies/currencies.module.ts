import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';

@Module({
  providers: [CurrenciesService],
  controllers: [CurrenciesController],
})
export class CurrenciesModule {}
