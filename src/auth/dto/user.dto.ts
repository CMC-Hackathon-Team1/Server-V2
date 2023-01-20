import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @ApiProperty({ description: '이메일', example: 'test@test.com', required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  email: string;
  @ApiProperty({ description: '비밀번호. (자체로그인에만 필수로 사용됩니다.)', example: 'test', required: true })
  @IsString()
  @MaxLength(255)
  password: string | null;
}
