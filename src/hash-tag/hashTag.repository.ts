import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedHashTagMapping } from '../common/entities/FeedHashTagMapping';
import { HashTags } from '../common/entities/HashTags';

@Injectable()
export class HashTagRepository {
  
  constructor(
    @InjectRepository(HashTags)
    private hashTagTable: Repository<HashTags>,
  ) {}

  async removeById(originHashTag: FeedHashTagMapping) {
    return this.hashTagTable.delete(originHashTag.id);
  }
  async saveHashTag(hashTagEntity: HashTags) {
    return this.hashTagTable.save(hashTagEntity);
  }

  async findByName(hashTag: string) {
    const query = this.hashTagTable.find({
      where: {
        hashTagName: hashTag,
      },
    });
    return query; //수정.
  }
}
