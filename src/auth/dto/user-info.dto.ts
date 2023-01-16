import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDTO {
  @ApiProperty({ description: '유저 ID' })
  userId: string;
  @ApiProperty({ description: '이메일' })
  email: string;
  @ApiProperty({ description: '비밀번호' })
  password: string;
  alarmToken: string;
}
