import { AwsService } from './../aws/aws.service';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaRepository } from '../persona/persona.repository';
import { Persona } from '../_entities/Persona';
import { Profiles } from '../_entities/Profiles';
import { ProfilesController } from './profiles.controller';
import { ProfilesRepository } from './profiles.repository';
import { ProfilesService } from './profiles.service';

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
