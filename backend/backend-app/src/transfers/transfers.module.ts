import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { FxModule } from '../fx/fx.module';
import { ComplianceModule } from '../compliance/compliance.module';

@Module({
  imports: [FxModule, ComplianceModule],
  providers: [TransfersService],
  controllers: [TransfersController],
})
export class TransfersModule {}
