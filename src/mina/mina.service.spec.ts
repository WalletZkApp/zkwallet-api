import { Test, TestingModule } from '@nestjs/testing';
import { MinaService } from './mina.service';

describe('MinaService', () => {
  let service: MinaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinaService],
    }).compile();

    service = module.get<MinaService>(MinaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
