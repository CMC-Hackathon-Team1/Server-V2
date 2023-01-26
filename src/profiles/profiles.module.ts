import { AwsService } from './../aws/aws.service';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaRepository } from '../persona/persona.repository';
import { Persona } from '../common/entities/Persona';
import { Profiles } from '../common/entities/Profiles';
import { ProfilesController } from './controller/profiles.controller';
import { ProfilesRepository } from './profiles.repository';
import { ProfilesService } from './service/profiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profiles, Persona])],
  controllers: [ProfilesController],
  providers: [
    ProfilesService,
    ProfilesRepository,
    PersonaRepository,
    AwsService,
  ],
  exports: [ProfilesRepository, PersonaRepository]
})
export class ProfilesModule {}
