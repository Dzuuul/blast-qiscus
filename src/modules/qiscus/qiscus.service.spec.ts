import { Test, TestingModule } from '@nestjs/testing';
import { QiscusService } from './qiscus.service';

describe('QiscusService', () => {
  let service: QiscusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QiscusService],
    }).compile();

    service = module.get<QiscusService>(QiscusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
