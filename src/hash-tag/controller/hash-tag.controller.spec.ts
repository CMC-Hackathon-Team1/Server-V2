import { Test, TestingModule } from '@nestjs/testing';
import { HashTagController } from './hash-tag.controller';

describe('HashTagController', () => {
  let controller: HashTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HashTagController],
    }).compile();

    controller = module.get<HashTagController>(HashTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
