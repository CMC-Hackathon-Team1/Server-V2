import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from '../_entities/Persona';
import { PersonaController } from './persona.controller';
import { PersonaRepository } from './persona.repository';
import { PersonaService } from './persona.service';

@Module({
  imports: [TypeOrmModule.forFeature([Persona])],
  controllers: [PersonaController],
  providers: [PersonaService, PersonaRepository],
  exports: [PersonaRepository]
})
export class PersonaModule {}
