import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedHashTagMapping } from '../common/entities/FeedHashTagMapping';

@Injectable()
export class hashTagFeedMappingRepository {
  removeById(originHashTag: FeedHashTagMapping) {
    this.HFmapping.delete(originHashTag.id);
  }
  constructor(
    @InjectRepository(FeedHashTagMapping)
    private HFmapping: Repository<FeedHashTagMapping>,
  ) {}

  async save(feedHashTagMapping: FeedHashTagMapping) {
    return this.HFmapping.save(feedHashTagMapping);
  }

  async delete(idList:number[]) {
    return this.HFmapping.delete(idList);
  }
}
