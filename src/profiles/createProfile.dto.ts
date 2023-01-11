import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateProfileDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @MaxLength(20)
  @IsString()
  profileName: string;

  @IsNotEmpty()
  @IsNumber()
  personaId: number;

  @IsNotEmpty()
  @IsString()
  profileImgUrl: string;

  @MaxLength(30)
  @IsString()
  statusMessage: string;
}