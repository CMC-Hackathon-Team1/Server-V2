import { AwsService } from '../../aws/aws.service';
import { multerOptions } from '../../common/utils/multer.option';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTAuthGuard } from '../../auth/security/auth.guard.jwt';
import baseResponse from '../../common/utils/baseResponseStatus';
import { errResponse, sucResponse } from '../../common/utils/response';
import { CreateProfileDto } from '../dto/createProfile.dto';
import { EditProfileDto } from '../dto/editProfile.dto';
import { ProfileModelExample } from '../dto/profile.model';
import { ProfilesService } from '../service/profiles.service';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(
    private profilesService: ProfilesService,
    private readonly AwsService: AwsService,
  ) {}

  // API No. 1.1 프로필 생성
  @ApiOperation({
    summary: '프로필 생성',
    description:
      'profileName, personaName, statusMessage, image를 form-data 형식으로 전달해야 함 (파일을 전송해야 하므로 Swagger에서는 테스트 불가)\n\nprofileName, personaName: 필수\n\nstatusMessage, image: 필수 X\n\n※ 각 key의 이름은 바꾸면 안됨 (image -> profileImg X)\n\n※ image는 이미지 파일 자체가 value (별도의 작업 없이 파일 자체를 전송하면 됨)\n\n(자세한 예시는 Notion 참고)',
  })
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
  @UseInterceptors(FileInterceptor('image'))
  createProfile(
    @UploadedFile() image: Express.Multer.File,
    @Body() createProfileDto: CreateProfileDto,
    @Request() req: any,
  ) {
    return this.profilesService.createProfile(image, req, createProfileDto);
  }

  // API No. 3.1 프로필 삭제
  @ApiOperation({
    summary: '프로필 삭제',
    description: '프로필 삭제에 관한 API',
  })
  @ApiBearerAuth('Authorization')
  @ApiBody({ schema: { example: { profileId: 1 } } })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: { example: sucResponse(baseResponse.SUCCESS) },
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
  @ApiResponse({
    status: 1504,
    description: '자신의 프로필이 아닌 경우',
    schema: { example: errResponse(baseResponse.PROFILE_NO_AUTHENTICATION) },
  })
  @UseGuards(JWTAuthGuard)
  @Post('/delete')
  deleteProfile(
    @Body('profileId', ParseIntPipe) profileId: number,
    @Request() req: any,
  ) {
    return this.profilesService.deleteProfile(req, profileId);
  }

  // API No. 3.1 프로필 수정
  @ApiOperation({
    summary: '프로필 수정',
    description:
      '프로필을 생성하는 경우와 Body가 유사하지만, 페르소나는 변경이 불가능하므로 프로필 수정 Body에서는 제외됩니다.\n\nprofileName, statusMessage, image, defaultImage를 받아야 하며 image는 생략이 가능합니다.\n\nstatusMessage가 비어있는 경우는 빈 문자열을 보내주시면 됩니다\n\ndefaultImage와 image의 작동은 아래와 같습니다\n\n1. defaultImage: true && image: 있음/없음 -> 기본 이미지로 변경\n\n2. defaultImage: false && image: 있음 -> 새로운 이미지로 변경\n\n3. defaultImage: false && image: 없음 -> 기존 이미지\n\n자세한 내용은 노션을 참고해주세요.',
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
  @ApiResponse({
    status: 1504,
    description: '자신의 프로필이 아닌 경우',
    schema: { example: errResponse(baseResponse.PROFILE_NO_AUTHENTICATION) },
  })
  @UseGuards(JWTAuthGuard)
  @Post('/edit/:profileId')
  @UseInterceptors(FileInterceptor('image'))
  editProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
    @UploadedFile() image: Express.Multer.File,
    @Request() req: any,
    @Body() editProfileDto: EditProfileDto,
  ) {
    return this.profilesService.editProfile(profileId, image, req, editProfileDto);
  }

  // API No. 1.2 프로필 변경
  // 프로필 변경을 할 수 있도록 사용자의 모든 프로필을 제공
  @ApiOperation({
    summary: '사용자 프로필 목록 가져오기',
    description:
      '멀티 페르소나를 위해 사용자의 모든 프로필 목록을 가져오는 API (Header의 JWT를 제외한 별도 데이터 필요 X)',
  })
  @ApiBearerAuth('Authorization')
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: {
      example: sucResponse(baseResponse.SUCCESS, [
        { ProfileModelExample },
        { ProfileModelExample },
      ]),
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parameter 오류',
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
    status: 1503,
    description: '사용자의 프로필이 없는 경우',
    schema: { example: errResponse(baseResponse.USER_NO_PROFILE) },
  })
  @ApiResponse({
    status: 1504,
    description: '자신의 프로필이 아닌 경우',
    schema: { example: errResponse(baseResponse.PROFILE_NO_AUTHENTICATION) },
  })
  @UseGuards(JWTAuthGuard)
  @Get('/my-profiles')
  getUserProfilesList(@Request() req: any) {
    return this.profilesService.getUserProfilesList(req);
  }

  // API No. 2.5 타유저 프로필
  @ApiOperation({
    summary: '프로필 ID로 프로필 받아오기',
    description:
      'API No. 2.5 타유저 프로필 등에서 활용 가능하도록 프로필 ID를 이용해 프로필 정보를 받아오는 API',
  })
  @ApiBearerAuth('Authorization')
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: { example: sucResponse(baseResponse.SUCCESS, ProfileModelExample) },
  })
  @ApiResponse({
    status: 400,
    description: 'Parameter 오류',
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
  @Get('/:profileId')
  getProfileByProfileId(@Param('profileId', ParseIntPipe) profileId: number) {
    return this.profilesService.getProfileByProfileId(profileId);
  }

  /* @ApiOperation({ summary: '사용자 프로필 사진 업로드(테스트)' })
  @Post('/uploadTest')
  //                  'image' 라는 key로 body에서 가져오겠다~
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImageTest(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    //                                    S3의 imageTest라는 경로에 해당 파일을 저장하겠다~
    return await this.AwsService.uploadFileToS3('imageTest', file);
  }

  @ApiOperation({ summary: '사용자 프로필 가져오기(테스트)' })
  @UseGuards(JWTAuthGuard)
  @Get('/image')
  // 대충 인증 헤더에서 가져온 사용자 정보를 가지고 프로필 userId 추출하는 컨트롤러
  async getProfileImageURLTest() {
    return await this.AwsService.getAwsS3FileUrl('tempUserUUID');
  } */
}
