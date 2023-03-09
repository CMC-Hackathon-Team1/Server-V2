import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowFromTo } from '../common/entities/FollowFromTo';
import { Likes } from '../common/entities/Likes';
import { Profiles } from '../common/entities/Profiles';
import { Users } from '../common/entities/Users';
import { FollowingRepository } from '../following/following.repository';
import { LikesRepository } from '../likes/likes.repository';
import { ProfilesRepository } from '../profiles/profiles.repository';
import { UsersRepository } from '../users/users.repository';
import { AlarmsController } from './controller/alarms.controller';
import { AlarmsService } from './service/alarms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profiles, FollowFromTo, Users, Likes])],
  controllers: [AlarmsController],
  providers: [AlarmsService, ProfilesRepository, FollowingRepository, UsersRepository, LikesRepository]
})
export class AlarmsModule {}
