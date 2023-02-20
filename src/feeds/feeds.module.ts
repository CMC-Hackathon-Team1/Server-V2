import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesRepository } from '../likes/likes.repository';
import { Feeds } from '../common/entities/Feeds';
import { Likes } from '../common/entities/Likes';
import { FeedsController } from './controller/feeds.controller';
import { FeedRepository } from './feeds.repository';
import { FeedsService } from './service/feeds.service';
import { ProfilesRepository } from '../profiles/profiles.repository';
import { Profiles } from '../common/entities/Profiles';
import { HashTagRepository } from '../hash-tag/hashTag.repository';
import { HashTags } from '../common/entities/HashTags';
import { FeedHashTagMapping } from '../common/entities/FeedHashTagMapping';
import { hashTagFeedMappingRepository } from '../hash-tag-feed-mapping/hash-tag-feed-mapping.repository';
import { AwsService } from '../aws/aws.service';
import { FeedImgsRepository } from './feedImgs.repository';
import { FeedImgs } from '../common/entities/FeedImgs';
import { FollowingRepository } from '../following/following.repository';
import { FollowFromTo } from '../common/entities/FollowFromTo';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Feeds,
      Likes,
      Profiles,
      HashTags,
      FeedHashTagMapping,
      FeedImgs,
      FollowFromTo,
    ]),
  ],
  controllers: [FeedsController],
  providers: [
    FeedsService,
    FeedRepository,
    LikesRepository,
    ProfilesRepository,
    HashTagRepository,
    hashTagFeedMappingRepository,
    FeedImgsRepository,
    AwsService,
    FollowingRepository,
  ],
  exports: [
    FeedRepository,
    LikesRepository,
    ProfilesRepository,
    HashTagRepository,
    hashTagFeedMappingRepository,
    FeedImgsRepository,
    FollowingRepository,
  ],
})
export class FeedsModule {}
