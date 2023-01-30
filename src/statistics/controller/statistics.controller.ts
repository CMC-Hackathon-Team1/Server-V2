import { Controller, Get, Param, ParseIntPipe, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { StatisticsService } from '../service/statistics.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from '../../auth/security/auth.guard.jwt';
import { Request, Response } from 'express';
import { errResponse, sucResponse } from "../../common/utils/response";
import baseResponse from "../../common/utils/baseResponseStatus";

@ApiTags('수치화 API')
@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  // TODO: 1.5.1 ~ 1.5.3 을 한번에 불러올지, 각각 따로 불러올지?
  // API No. 1.5.0 수치화 - 전체

  // API No. 1.5.1. 수치화 - 공감 수
  @ApiOperation({
    summary: '1.5.1. 수치화 - 공감 수',
    description: '사용자가 받은 월별 공감수를 받는다.',
  })
  // @UsePipes(ValidationPipe)
  @UseGuards(JWTAuthGuard)
  @Get('/:id/likes/monthly')
  async getMonthlyLikes(
    @Req() req: Request,
    @Param('id', ParseIntPipe) profileId: number,
  ): Promise<any> {
    const user: any = req.user;
    // console.log(user.userId, profileId);
    // console.log(typeof profileId);

    // [Validation 처리]
    // jwt 토큰 유저 정보와 profileId 가 맞게 매칭되어 있는가
    const checkProfileMatch = await this.statisticsService.checkProfile(user.userId, profileId);
    // console.log(checkProfileMatch);

    if (!checkProfileMatch) {
      return errResponse(baseResponse.PROFILE_NOT_MATCH);
    }
    // ---

    const statsResult = await this.statisticsService.getMonthlyLikes(profileId);

    return sucResponse(baseResponse.SUCCESS, {
      monthly_likes_count: statsResult,
    });
  }

  // API No. 1.5.2. 수치화 - 게시글 수

  // API No. 1.5.3. 수치화 - 팔로우 수
}
