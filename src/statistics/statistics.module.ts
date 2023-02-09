import { Module } from '@nestjs/common';
import { StatisticsController } from './controller/statistics.controller';
import { StatisticsService } from './service/statistics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from '../common/entities/Likes';
import { Feeds } from '../common/entities/Feeds';
import { FollowFromTo } from '../common/entities/FollowFromTo';
import { Profiles } from '../common/entities/Profiles';
import { ProfilesService } from "../profiles/service/profiles.service";
import { ProfilesRepository } from "../profiles/profiles.repository";
import { Persona } from "../common/entities/Persona";
import { PersonaRepository } from "../persona/persona.repository";
import { AwsService } from "../aws/aws.service";

// TODO: Module-Controller-Service-(Repository) 구조 리팩토링? - Service와 Repository를 나눠야하는가?
@Module({
  imports: [
    TypeOrmModule.forFeature([Likes, Feeds, FollowFromTo, Profiles, Persona]),
  ],
  exports: [StatisticsService, ProfilesRepository, PersonaRepository],
  controllers: [StatisticsController],
  providers: [
    StatisticsService,
    ProfilesService,
    ProfilesRepository,
    PersonaRepository,
    AwsService,
  ],
})
export class StatisticsModule {}
