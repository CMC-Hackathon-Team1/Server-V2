import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SetAlarmDto {
  @ApiProperty({ description: '0: 수신 거부 / 1: 수신 허용'})
  @IsNotEmpty()
  statusCode: number;
}