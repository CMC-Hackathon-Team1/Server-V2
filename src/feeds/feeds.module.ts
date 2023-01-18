import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesRepository } from '../likes/likes.repository';
import { Feeds } from '../_entities/Feeds';
import { Likes } from '../_entities/Likes';
import { FeedsController } from './feeds.controller';
import { FeedRepository } from './feeds.repository';
import { FeedsService } from './feeds.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feeds,Likes])
  ],
  controllers: [FeedsController],
  providers: [FeedsService,FeedRepository,LikesRepository],
  exports: [FeedRepository,LikesRepository]
})
export class FeedsModule {}
