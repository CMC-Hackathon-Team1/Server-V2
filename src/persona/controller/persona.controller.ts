import { Controller, Get } from '@nestjs/common';
import { PersonaService } from '../service/persona.service';

@Controller('persona')
export class PersonaController {
  constructor(private personaService: PersonaService) {}

  // 모든 페르소나 불러오기
  /* @Get()
  getPersonas() {
    return this.personaService.getPersonas();
  } */
}
