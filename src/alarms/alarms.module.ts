import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profiles } from '../common/entities/Profiles';
import { ProfilesRepository } from '../profiles/profiles.repository';
import { AlarmsController } from './controller/alarms.controller';
import { AlarmsService } from './service/alarms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profiles])],
  controllers: [AlarmsController],
  providers: [AlarmsService, ProfilesRepository]
})
export class AlarmsModule {}
