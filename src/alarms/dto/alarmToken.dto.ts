import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AlarmTokenDto {
  @ApiProperty({
    description: '푸시 알림 전송용 기기별 토큰값'
  })
  @IsNotEmpty()
  alarmToken: string;
}