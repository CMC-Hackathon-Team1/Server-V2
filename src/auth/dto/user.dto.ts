import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @ApiProperty({ description: '이메일', example: 'test@test.com', required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  email: string;
  @ApiProperty({ description: '비밀번호', example: 'test', required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  password: string;
}
