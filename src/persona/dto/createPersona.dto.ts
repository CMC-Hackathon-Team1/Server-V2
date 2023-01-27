import { IsNotEmpty, MaxLength } from "class-validator";

export class CreatePersonaDto {
  @IsNotEmpty()
  @MaxLength(45)
  personaName: string;
}