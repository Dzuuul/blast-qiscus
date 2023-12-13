import { Test, TestingModule } from '@nestjs/testing';
import { QiscusController } from './qiscus.controller';

describe('QiscusController', () => {
  let controller: QiscusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QiscusController],
    }).compile();

    controller = module.get<QiscusController>(QiscusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
