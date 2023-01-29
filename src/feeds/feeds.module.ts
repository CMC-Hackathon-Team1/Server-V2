import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesRepository } from '../likes/likes.repository';
import { Feeds } from '../common/entities/Feeds';
import { Likes } from '../common/entities/Likes';
import { FeedsController } from './feeds.controller';
import { FeedRepository } from './feeds.repository';
import { FeedsService } from './feeds.service';
import { ProfilesRepository } from '../profiles/profiles.repository';
import { Profiles } from '../common/entities/Profiles';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feeds,Likes,Profiles])
  ],
  controllers: [FeedsController],
  providers: [FeedsService,FeedRepository,LikesRepository,ProfilesRepository],
  exports: [FeedRepository,LikesRepository,ProfilesRepository]
})
export class FeedsModule {}
