import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmsService } from '../alarms/service/alarms.service';
import { FollowFromTo } from '../common/entities/FollowFromTo';
import { Profiles } from '../common/entities/Profiles';
import { Users } from '../common/entities/Users';
import { ProfilesRepository } from '../profiles/profiles.repository';
import { UsersRepository } from '../users/users.repository';
import { FollowingController } from './controller/following.controller';
import { FollowingRepository } from './following.repository';
import { FollowingService } from './service/following.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FollowFromTo,Profiles,Users])
  ],
  controllers: [FollowingController],
  providers: [FollowingService,FollowingRepository,ProfilesRepository, AlarmsService, UsersRepository],
  exports: [FollowingRepository,ProfilesRepository,UsersRepository]
})
export class FollowingModule {}
