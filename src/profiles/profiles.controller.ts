import { Body, Controller, ParseIntPipe, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from '../auth/security/auth.guard.jwt';
import baseResponse from '../_utilities/baseResponseStatus';
import { errResponse, sucResponse } from '../_utilities/response';
import { CreateProfileDto } from './createProfile.dto';
import { ProfilesService } from './profiles.service';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  // API No. 1.1 프로필 생성
  @ApiOperation({ summary: '프로필 생성', description: '프로필 생성' })
  @ApiBearerAuth('Authorization')
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: {  example: sucResponse(baseResponse.SUCCESS, { profileId: 25 }) },
  })
  @ApiResponse({
    status: 400,
    description: 'Body 오류',
    schema: { example: baseResponse.PIPE_ERROR_EXAMPLE },
  })
  @ApiResponse({
    status: 401,
    description: 'JWT 오류',
    schema: { example: errResponse(baseResponse.JWT_UNAUTHORIZED) },
  })
  @ApiResponse({
    status: 501,
    description: '서버 오류',
    schema: { example: errResponse(baseResponse.SERVER_ERROR) },
  })
  @ApiResponse({
    status: 1500,
    description: '사용자 프로필은 3개까지 생성 가능합니다.',
    schema: {
      example: errResponse(baseResponse.PROFILE_COUNT_OVER, {
        currentProfileCount: 3,
      }),
    },
  })
  @ApiResponse({
    status: 1501,
    description: '사용자에게 해당 페르소나가 이미 존재합니다.',
    schema: { example: errResponse(baseResponse.PROFILE_SAME_PERSONA) },
  })
  @UseGuards(JWTAuthGuard)
  @Post('/create')
  @UsePipes(ValidationPipe)
  createProfile(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.createProfile(createProfileDto);
  }

  // 3.1 프로필 삭제
  @UseGuards(JWTAuthGuard)
  @Post('/delete')
  deleteProfile(@Body('profileId', ParseIntPipe) profileId: number) {
    return this.profilesService.deleteProfile(profileId);
  }
}
