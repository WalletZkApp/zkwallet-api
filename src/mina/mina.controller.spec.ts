import { Test, TestingModule } from '@nestjs/testing';
import { MinaController } from './mina.controller';

describe('MinaController', () => {
  let controller: MinaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MinaController],
    }).compile();

    controller = module.get<MinaController>(MinaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
