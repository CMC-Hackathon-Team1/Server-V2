import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesRepository } from '../likes/likes.repository';
import { Feeds } from '../common/entities/Feeds';
import { Likes } from '../common/entities/Likes';
import { FeedsController } from './controller/feeds.controller';
import { FeedRepository } from './feeds.repository';
import { FeedsService } from './service/feeds.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feeds,Likes])
  ],
  controllers: [FeedsController],
  providers: [FeedsService,FeedRepository,LikesRepository],
  exports: [FeedRepository,LikesRepository]
})
export class FeedsModule {}
