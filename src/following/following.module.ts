import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowFromTo } from '../common/entities/FollowFromTo';
import { Profiles } from '../common/entities/Profiles';
import { ProfilesRepository } from '../profiles/profiles.repository';
import { FollowingController } from './controller/following.controller';
import { FollowingRepository } from './following.repository';
import { FollowingService } from './service/following.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FollowFromTo,Profiles])
  ],
  controllers: [FollowingController],
  providers: [FollowingService,FollowingRepository,ProfilesRepository],
  exports: [FollowingRepository,ProfilesRepository]
})
export class FollowingModule {}
