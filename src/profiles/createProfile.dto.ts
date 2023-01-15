import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProfileDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @MaxLength(20)
  @IsString()
  profileName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  personaName: string;

  @IsNotEmpty()
  @IsString()
  profileImgUrl: string;

  @IsOptional()
  @MaxLength(100)
  @IsString()
  statusMessage: string;
}