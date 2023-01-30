import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowFromTo } from '../common/entities/FollowFromTo';
import { FollowingController } from './controller/following.controller';
import { FollowingRepository } from './following.repository';
import { FollowingService } from './service/following.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FollowFromTo])
  ],
  controllers: [FollowingController],
  providers: [FollowingService,FollowingRepository],
  exports: [FollowingRepository]
})
export class FollowingModule {}
