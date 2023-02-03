import { Test, TestingModule } from '@nestjs/testing';
import { HashTagService } from './hash-tag.service';

describe('HashTagService', () => {
  let service: HashTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashTagService],
    }).compile();

    service = module.get<HashTagService>(HashTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
