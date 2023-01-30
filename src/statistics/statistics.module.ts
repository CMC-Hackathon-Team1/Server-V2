import { Module } from '@nestjs/common';
import { StatisticsController } from './controller/statistics.controller';
import { StatisticsService } from './service/statistics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from '../common/entities/Likes';
import { Feeds } from '../common/entities/Feeds';
import { FollowFromTo } from '../common/entities/FollowFromTo';
import { Profiles } from '../common/entities/Profiles';

@Module({
  imports: [TypeOrmModule.forFeature([Likes, Feeds, FollowFromTo, Profiles])],
  exports: [StatisticsService],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
