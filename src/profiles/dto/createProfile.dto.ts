import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ description: '프로필 이름', example: '작가 야옹이' })
  @IsNotEmpty()
  @MaxLength(20)
  @IsString()
  profileName: string;

  @ApiProperty({ description: '페르소나 이름', example: '작가' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  personaName: string;

  @ApiProperty({
    description: '상태 메시지',
    example: '작가가 되고싶은 야옹이',
    required: false,
  })
  @IsOptional()
  @MaxLength(100)
  @IsString()
  statusMessage: string;

  @ApiProperty({
    description: '프로필 이미지 파일',
    example: 'profileImg.png',
    required: false,
  })
  image: object;
}
