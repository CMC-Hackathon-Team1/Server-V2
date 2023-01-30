import { Controller, Get, Param, ParseIntPipe, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { StatisticsService } from '../service/statistics.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JWTAuthGuard } from '../../auth/security/auth.guard.jwt';
import { Request, Response } from 'express';
import { errResponse, sucResponse } from '../../common/utils/response';
import baseResponse from '../../common/utils/baseResponseStatus';

@ApiTags('수치화 API')
@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  // TODO: 1.5.1 ~ 1.5.3 을 한번에 불러올지, 각각 따로 불러올지?
  // API No. 1.5.0 수치화 - 전체
  @ApiOperation({
    summary: '1.5.0. 수치화 - 월별 공감,게시글,팔로워 수',
    description: '사용자가 받은 월별 공감 수를 받는다.',
  })
  @ApiBearerAuth('Authorization')
  @ApiParam({
    name: 'profileId',
    required: true,
    description: '현재 유저의 profileId',
  })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: {
      example: sucResponse(baseResponse.SUCCESS, {
        monthly_likes_count: 5,
        monthly_myFeeds_count: 5,
        monthly_myFollowers_count: 5,
      }),
    },
  })
  @ApiResponse({
    status: 400,
    description: 'profileId가 없거나 숫자 외에 다른 값으로 입력한 경우',
    schema: { example: baseResponse.PARSEINT_PIPE_ERROR_EXAMPLE },
  })
  @ApiResponse({
    status: 401,
    description: 'JWT 오류',
    schema: { example: errResponse(baseResponse.JWT_UNAUTHORIZED) },
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
    schema: { example: errResponse(baseResponse.SERVER_ERROR) },
  })
  @ApiResponse({
    status: 1506,
    description: 'jwt 토큰의 유저와 프로필이 서로 일치하지 않음',
    schema: { example: errResponse(baseResponse.PROFILE_NOT_MATCH) },
  })
  // @UsePipes(ValidationPipe)
  @UseGuards(JWTAuthGuard)
  @Get('/:profileId/monthly')
  async getMonthlyStats(
    @Req() req: Request,
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<any> {
    const user: any = req.user;
    // console.log(user.userId, profileId);
    // console.log(typeof profileId);

    // [Validation 처리]
    // profileId 가 있는가
    if (!profileId) {
      return errResponse(baseResponse.PROFILE_ID_NOT_FOUND);
    }
    // jwt 토큰 유저 정보와 profileId 가 맞게 매칭되어 있는가
    const checkProfileMatch = await this.statisticsService.checkProfile(user.userId, profileId);
    // console.log(checkProfileMatch);

    if (!checkProfileMatch) {
      return errResponse(baseResponse.PROFILE_NOT_MATCH);
    }
    // ---

    const monthBeforeNowDate = new Date();
    monthBeforeNowDate.setDate(monthBeforeNowDate.getMonth() - 1);
    // console.log(monthBeforeNowDate);
    const nowDate = new Date();

    const likeCount = await this.statisticsService.getMonthlyLikes(profileId, monthBeforeNowDate, nowDate);
    const feedCount = await this.statisticsService.getMonthlyFeeds(profileId, monthBeforeNowDate, nowDate);
    const followerCount = await this.statisticsService.getMonthlyFollowers(profileId, monthBeforeNowDate, nowDate);

    return sucResponse(baseResponse.SUCCESS, {
      monthly_likes_count: likeCount,
      monthly_myFeeds_count: feedCount,
      monthly_myFollowers_count: followerCount,
    });
  }

  // API No. 1.5.1. 수치화 - 공감 수
  @ApiOperation({
    summary: '1.5.1. 수치화 - 공감 수',
    description: '사용자가 받은 월별 공감 수를 받는다.',
  })
  @ApiBearerAuth('Authorization')
  @ApiParam({
    name: 'profileId',
    required: true,
    description: '현재 유저의 profileId',
  })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: {
      example: sucResponse(baseResponse.SUCCESS, {
        monthly_likes_count: 5,
      }),
    },
  })
  @ApiResponse({
    status: 400,
    description: 'profileId가 없거나 숫자 외에 다른 값으로 입력한 경우',
    schema: { example: baseResponse.PARSEINT_PIPE_ERROR_EXAMPLE },
  })
  @ApiResponse({
    status: 401,
    description: 'JWT 오류',
    schema: { example: errResponse(baseResponse.JWT_UNAUTHORIZED) },
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
    schema: { example: errResponse(baseResponse.SERVER_ERROR) },
  })
  @ApiResponse({
    status: 1506,
    description: 'jwt 토큰의 유저와 프로필이 서로 일치하지 않음',
    schema: { example: errResponse(baseResponse.PROFILE_NOT_MATCH) },
  })
  // @UsePipes(ValidationPipe)
  @UseGuards(JWTAuthGuard)
  @Get('/:profileId/likes/monthly')
  async getMonthlyLikes(
    @Req() req: Request,
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<any> {
    const user: any = req.user;

    // [Validation 처리]
    // profileId 가 있는가
    if (!profileId) {
      return errResponse(baseResponse.PROFILE_ID_NOT_FOUND);
    }
    // jwt 토큰 유저 정보와 profileId 가 맞게 매칭되어 있는가
    const checkProfileMatch = await this.statisticsService.checkProfile(user.userId, profileId);
    // console.log(checkProfileMatch);

    if (!checkProfileMatch) {
      return errResponse(baseResponse.PROFILE_NOT_MATCH);
    }
    // ---

    const monthBeforeNowDate = new Date();
    monthBeforeNowDate.setDate(monthBeforeNowDate.getMonth() - 1);
    // console.log(monthBeforeNowDate);
    const nowDate = new Date();

    const statsResult = await this.statisticsService.getMonthlyLikes(profileId, monthBeforeNowDate, nowDate);

    return sucResponse(baseResponse.SUCCESS, {
      monthly_likes_count: statsResult,
    });
  }

  // API No. 1.5.2. 수치화 - 게시글 수
  @ApiOperation({
    summary: '1.5.2. 수치화 - 게시글 수',
    description: '사용자가 작성한 월별 게시글 수를 받는다.',
  })
  @ApiBearerAuth('Authorization')
  @ApiParam({
    name: 'profileId',
    required: true,
    description: '현재 유저의 profileId',
  })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: {
      example: sucResponse(baseResponse.SUCCESS, {
        monthly_myFeeds_count: 5,
      }),
    },
  })
  @ApiResponse({
    status: 400,
    description: 'profileId가 없거나 숫자 외에 다른 값으로 입력한 경우',
    schema: { example: baseResponse.PARSEINT_PIPE_ERROR_EXAMPLE },
  })
  @ApiResponse({
    status: 401,
    description: 'JWT 오류',
    schema: { example: errResponse(baseResponse.JWT_UNAUTHORIZED) },
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
    schema: { example: errResponse(baseResponse.SERVER_ERROR) },
  })
  @ApiResponse({
    status: 1506,
    description: 'jwt 토큰의 유저와 프로필이 서로 일치하지 않음',
    schema: { example: errResponse(baseResponse.PROFILE_NOT_MATCH) },
  })
  // @UsePipes(ValidationPipe)
  @UseGuards(JWTAuthGuard)
  @Get('/:profileId/my-feeds/monthly')
  async getMonthlyFeeds(
    @Req() req: Request,
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<any> {
    const user: any = req.user;

    // [Validation 처리]
    // profileId 가 있는가
    if (!profileId) {
      return errResponse(baseResponse.PROFILE_ID_NOT_FOUND);
    }
    // jwt 토큰 유저 정보와 profileId 가 맞게 매칭되어 있는가
    const checkProfileMatch = await this.statisticsService.checkProfile(user.userId, profileId);
    // console.log(checkProfileMatch);

    if (!checkProfileMatch) {
      return errResponse(baseResponse.PROFILE_NOT_MATCH);
    }
    // ---

    const monthBeforeNowDate = new Date();
    monthBeforeNowDate.setDate(monthBeforeNowDate.getMonth() - 1);
    // console.log(monthBeforeNowDate);
    const nowDate = new Date();

    const statsResult = await this.statisticsService.getMonthlyFeeds(profileId, monthBeforeNowDate, nowDate);

    return sucResponse(baseResponse.SUCCESS, {
      monthly_myFeeds_count: statsResult,
    });
  }

  // API No. 1.5.3. 수치화 - 팔로우 수
  @ApiOperation({
    summary: '1.5.3. 수치화 - 팔로우 수',
    description: '사용자를 팔로우한 월별 팔로우 수를 받는다.',
  })
  @ApiBearerAuth('Authorization')
  @ApiParam({
    name: 'profileId',
    required: true,
    description: '현재 유저의 profileId',
  })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: {
      example: sucResponse(baseResponse.SUCCESS, {
        monthly_myFollowers_count: 5,
      }),
    },
  })
  @ApiResponse({
    status: 400,
    description: 'profileId가 없거나 숫자 외에 다른 값으로 입력한 경우',
    schema: { example: baseResponse.PARSEINT_PIPE_ERROR_EXAMPLE },
  })
  @ApiResponse({
    status: 401,
    description: 'JWT 오류',
    schema: { example: errResponse(baseResponse.JWT_UNAUTHORIZED) },
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
    schema: { example: errResponse(baseResponse.SERVER_ERROR) },
  })
  @ApiResponse({
    status: 1506,
    description: 'jwt 토큰의 유저와 프로필이 서로 일치하지 않음',
    schema: { example: errResponse(baseResponse.PROFILE_NOT_MATCH) },
  })
  // @UsePipes(ValidationPipe)
  @UseGuards(JWTAuthGuard)
  @Get('/:profileId/followers/monthly')
  async getMonthlyFollowers(
    @Req() req: Request,
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<any> {
    const user: any = req.user;

    // [Validation 처리]
    // profileId 가 있는가
    if (!profileId) {
      return errResponse(baseResponse.PROFILE_ID_NOT_FOUND);
    }
    // jwt 토큰 유저 정보와 profileId 가 맞게 매칭되어 있는가
    const checkProfileMatch = await this.statisticsService.checkProfile(user.userId, profileId);
    // console.log(checkProfileMatch);

    if (!checkProfileMatch) {
      return errResponse(baseResponse.PROFILE_NOT_MATCH);
    }
    // ---

    const monthBeforeNowDate = new Date();
    monthBeforeNowDate.setDate(monthBeforeNowDate.getMonth() - 1);
    // console.log(monthBeforeNowDate);
    const nowDate = new Date();

    const statsResult = await this.statisticsService.getMonthlyFollowers(profileId, monthBeforeNowDate, nowDate);

    return sucResponse(baseResponse.SUCCESS, {
      monthly_myFollowers_count: statsResult,
    });
  }
}
