import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmsService } from '../alarms/service/alarms.service';
import { Feeds } from '../common/entities/Feeds';
import { Likes } from '../common/entities/Likes';
import { Profiles } from '../common/entities/Profiles';
import { Users } from '../common/entities/Users';
import { FeedRepository } from '../feeds/feeds.repository';
import { ProfilesRepository } from '../profiles/profiles.repository';
import { UsersRepository } from '../users/users.repository';
import { LikesController } from './controller/likes.controller';
import { LikesRepository } from './likes.repository';
import { LikesService } from './service/likes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Likes,Profiles,Feeds, Users])
  ],
  controllers: [LikesController],
  providers: [LikesService,LikesRepository,ProfilesRepository,FeedRepository, AlarmsService, UsersRepository],
  exports: [LikesRepository,ProfilesRepository,FeedRepository, UsersRepository]
})

export class LikesModule {}
