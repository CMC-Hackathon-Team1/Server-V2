import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class EditProfileDto {
  @ApiProperty({
    description: '프로필 이름',
    example: '작가 야옹이',
    required: true
  })
  @IsNotEmpty()
  @MaxLength(20)
  @IsString()
  profileName: string;

  @ApiProperty({
    description: '상태 메시지 (상태 메시지가 비어있다면 비어있는 문자열을 보내시면 됩니다)',
    example: '작가가 되고싶은 야옹이',
    required: true,
  })
  @MaxLength(100)
  statusMessage: string;

  @ApiProperty({
    description: '프로필 이미지 파일',
    example: 'profileImg.png',
    required: false,
  })
  image: object;

  @ApiProperty({
    description: '기본 프로필 이미지로 변경 여부 (true로 들어오는 경우 이미지의 유무와 상관없이 기본 프로필 이미지로 변경됩니다)\n\nform-data에는 boolean 타입이 들어가지 않는 것으로 보여 true(boolean) 또는 "true"(string)으로 보내주시면 됩니다. (단, 대소문자 구분)',
    example: true,
    required: true,
  })
  defaultImage: boolean | string;
}
