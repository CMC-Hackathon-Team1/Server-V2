import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmsService } from '../alarms/service/alarms.service';
import { Feeds } from '../common/entities/Feeds';
import { FollowFromTo } from '../common/entities/FollowFromTo';
import { Likes } from '../common/entities/Likes';
import { Profiles } from '../common/entities/Profiles';
import { Users } from '../common/entities/Users';
import { FeedRepository } from '../feeds/feeds.repository';
import { LikesRepository } from '../likes/likes.repository';
import { ProfilesRepository } from '../profiles/profiles.repository';
import { UsersRepository } from '../users/users.repository';
import { FollowingController } from './controller/following.controller';
import { FollowingRepository } from './following.repository';
import { FollowingService } from './service/following.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FollowFromTo,Profiles,Users,Feeds,Likes])
  ],
  controllers: [FollowingController],
  providers: [FollowingService,FollowingRepository,ProfilesRepository, AlarmsService, UsersRepository,FeedRepository,LikesRepository],
  exports: [FollowingRepository,ProfilesRepository,UsersRepository,FeedRepository,LikesRepository]
})
export class FollowingModule {}
