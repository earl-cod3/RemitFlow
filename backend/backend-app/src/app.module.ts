import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { WalletsModule } from './wallets/wallets.module';
import { FxModule } from './fx/fx.module';
import { ComplianceModule } from './compliance/compliance.module';
import { TransfersModule } from './transfers/transfers.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    CurrenciesModule,
    WalletsModule,
    FxModule,
    ComplianceModule,
    TransfersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
