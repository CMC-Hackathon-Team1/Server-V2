import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from '../common/entities/Persona';
import { PersonaController } from './controller/persona.controller';
import { PersonaRepository } from './persona.repository';
import { PersonaService } from './service/persona.service';

@Module({
  imports: [TypeOrmModule.forFeature([Persona])],
  controllers: [PersonaController],
  providers: [PersonaService, PersonaRepository],
  exports: [PersonaRepository]
})
export class PersonaModule {}
