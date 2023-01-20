import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class EditProfileDto {
  @ApiProperty({ description: '프로필 이름', example: '작가 야옹이' })
  @IsNotEmpty()
  @MaxLength(20)
  @IsString()
  profileName: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://imgURL.com',
  })
  @IsNotEmpty()
  @IsString()
  profileImgUrl: string;

  @ApiProperty({
    description: '상태 메시지',
    example: '작가가 되고싶은 야옹이',
    required: false,
  })
  @IsOptional()
  @MaxLength(100)
  statusMessage: string;
}
