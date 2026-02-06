import { Test, TestingModule } from '@nestjs/testing';
import { ExposController } from './expos.controller';

describe('ExposController', () => {
  let controller: ExposController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExposController],
    }).compile();

    controller = module.get<ExposController>(ExposController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
