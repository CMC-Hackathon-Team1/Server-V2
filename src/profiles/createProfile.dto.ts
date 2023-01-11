import { IsNotEmpty } from "class-validator";

export class CreateProfileDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  profileName: string;

  @IsNotEmpty()
  personaId: number;

  @IsNotEmpty()
  profileImgUrl: string;

  statusMessage: string;
}