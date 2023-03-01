import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feeds } from '../common/entities/Feeds';
import { Profiles } from '../common/entities/Profiles';
import { ReportContent } from '../common/entities/ReportContent';
import { Reports } from '../common/entities/Reports';
import { FeedRepository } from '../feeds/feeds.repository';
import { ProfilesRepository } from '../profiles/profiles.repository';
import { ReportsController } from './controller/reports.controller';
import { ReportsRepository } from './reports.repository';
import { ReportsService } from './service/reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reports, ReportContent, Feeds, Profiles])],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsRepository, FeedRepository, ProfilesRepository]
})
export class ReportsModule {}
