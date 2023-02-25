import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ChangeUserStatusDto {
  @ApiProperty({ description: '계정 공개상태', example: 'ACTIVE 또는 HIDDEN' })
  @IsString()
  userStatus: string;
}