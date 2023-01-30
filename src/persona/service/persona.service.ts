import { Injectable } from '@nestjs/common';
import { CreatePersonaDto } from '../dto/createPersona.dto';
import { PersonaModel } from '../persona.model';
import { PersonaRepository } from '../persona.repository';

@Injectable()
export class PersonaService {
  constructor(
    private personaRepository: PersonaRepository
  ) {}

  async getPersonas(): Promise<PersonaModel[]> {
    const personaList = await this.personaRepository.getPersonaList();

    return personaList;
  }

  async createPersona(createPersonaDto: CreatePersonaDto) {
    const newPersona = await this.personaRepository.createPersona(createPersonaDto);

    return newPersona;
  }
}
