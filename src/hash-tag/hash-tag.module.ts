import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashTags } from '../common/entities/HashTags';
import { HashTagController } from './controller/hash-tag.controller';
import { HashTagRepository } from './hashTag.repository';
import { HashTagService } from './service/hash-tag.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HashTags])
  ],
  controllers: [HashTagController],
  providers: [HashTagService,HashTagRepository],
  exports:[HashTagRepository]
})
export class HashTagModule {}
