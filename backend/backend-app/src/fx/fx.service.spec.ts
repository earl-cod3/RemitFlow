import { Test, TestingModule } from '@nestjs/testing';
import { FxService } from './fx.service';

describe('FxService', () => {
  let service: FxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FxService],
    }).compile();

    service = module.get<FxService>(FxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
