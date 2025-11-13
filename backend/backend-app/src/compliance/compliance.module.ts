import { Module } from '@nestjs/common';
import { ComplianceService } from './compliance.service';

@Module({
  providers: [ComplianceService],
  exports: [ComplianceService], // export so TransfersService can use it
})
export class ComplianceModule {}
