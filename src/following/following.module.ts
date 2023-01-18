import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowFromTo } from '../_entities/FollowFromTo';
import { FollowingController } from './following.controller';
import { FollowingRepository } from './following.repository';
import { FollowingService } from './following.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FollowFromTo])
  ],
  controllers: [FollowingController],
  providers: [FollowingService,FollowingRepository],
  exports: [FollowingRepository]
})
export class FollowingModule {}
