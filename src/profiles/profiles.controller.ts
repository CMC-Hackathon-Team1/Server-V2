import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTAuthGuard } from '../auth/security/auth.guard.jwt';
import baseResponse from '../_utilities/baseResponseStatus';
import { errResponse, sucResponse } from '../_utilities/response';
import { CreateProfileDto } from './dto/createProfile.dto';
import { EditProfileDto } from './dto/editProfile.dto';
import { ProfileModelExample } from './dto/profile.model';
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
    schema: { example: sucResponse(baseResponse.SUCCESS, { profileId: 25 }) },
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

  // API No. 3.1 프로필 삭제
  @ApiOperation({
    summary: '프로필 삭제',
    description: '프로필 삭제에 관한 API이며 현재 삭제 방식에 대한 논의 중',
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JWTAuthGuard)
  @ApiBody({ schema: { example: { profileId: 1 } } })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: { example: sucResponse(baseResponse.SUCCESS, { profileId: 25 }) },
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
    description: 'DB 오류',
    schema: { example: errResponse(baseResponse.DB_ERROR) },
  })
  @ApiResponse({
    status: 1502,
    description: 'profileId에 해당하는 프로필이 없는 경우',
    schema: { example: errResponse(baseResponse.PROFILE_NOT_EXIST) },
  })
  @Post('/delete')
  deleteProfile(@Body('profileId', ParseIntPipe) profileId: number) {
    return this.profilesService.deleteProfile(profileId);
  }

  // API No. 3.1 프로필 수정
  @ApiOperation({
    summary: '프로필 수정',
    description:
      '프로필을 생성하는 경우와 Body가 유사하지만, 페르소나는 변경이 불가능하므로 프로필 수정 Body에서는 제외된다.',
  })
  @ApiBearerAuth('Authorization')
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: { example: sucResponse(baseResponse.SUCCESS, ProfileModelExample) },
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
    description: 'DB 오류',
    schema: { example: errResponse(baseResponse.DB_ERROR) },
  })
  @ApiResponse({
    status: 1502,
    description: 'profileId에 해당하는 프로필이 없는 경우',
    schema: { example: errResponse(baseResponse.PROFILE_NOT_EXIST) },
  })
  @UseGuards(JWTAuthGuard)
  @Post('/edit/:profileId')
  editProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
    @Body() editProfileDto: EditProfileDto,
  ) {
    return this.profilesService.editProfile(profileId, editProfileDto);
  }

  @Get('/:profileId')
  getProfileByProfileId(
    @Param('profileId', ParseIntPipe) profileId: number
  ) {
    return this.profilesService.getProfileByProfileId(profileId);
  }
}
