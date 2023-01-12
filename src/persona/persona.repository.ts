import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Persona } from "../_entities/Persona";
import { CreatePersonaDto } from "./createPersona.dto";
import { PersonaModel } from "./persona.model";

@Injectable()
export class PersonaRepository {
  constructor(
    @InjectRepository(Persona)
    private personaTable: Repository<Persona>
  ) {}

  // 모든 페르소나 목록 가져오기
  async getPersonaList(): Promise<PersonaModel[]> {
    return await this.personaTable.find();
  }

  // 페르소나 생성
  async createPersona(createPersonaDto: CreatePersonaDto) {
    return await this.personaTable.save(createPersonaDto)
  }
}