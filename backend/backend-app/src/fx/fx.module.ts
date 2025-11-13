import { Module } from '@nestjs/common';
import { FxService } from './fx.service';
import { FxController } from './fx.controller';

@Module({
  providers: [FxService],
  controllers: [FxController],
  exports: [FxService], // ✅ export so TransfersService can inject it
})
export class FxModule {}
