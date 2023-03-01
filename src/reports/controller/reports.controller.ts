import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JWTAuthGuard } from '../../auth/security/auth.guard.jwt';
import baseResponse from '../../common/utils/baseResponseStatus';
import { ReportFeedsDto } from '../dto/reportFeeds.dto';
import { ReportsService } from '../service/reports.service';

@Controller('reports')
export class ReportsController {
  constructor(
    private reportsService: ReportsService
  ) {}

  
  // API No. 2.5 게시글 신고하기
  @ApiOperation({
    summary: '게시글 신고하기',
    description:
      'API No. 2.5 게시글 신고하기에 해당하는 API이며 요청 Body에 있는 feedId를 이용해 해당 게시글의 status를 REPORTED 상태로 변경한다.',
  })
  @ApiBearerAuth('Authorization')
  @ApiBody({ schema: { example: { feedId: 1 } } })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: { example: baseResponse.SUCCESS },
  })
  @ApiResponse({
    status: 400,
    description: 'Parameter 오류',
    schema: { example: baseResponse.PIPE_ERROR_EXAMPLE },
  })
  @ApiResponse({
    status: 401,
    description: 'JWT 오류',
    schema: { example: baseResponse.JWT_UNAUTHORIZED },
  })
  @ApiResponse({
    status: 501,
    description: 'DB 오류',
    schema: { example: baseResponse.DB_ERROR },
  })
  @ApiResponse({
    status: 2200,
    description: '해당 Feed가 존재하지 않는 경우',
    schema: { example: baseResponse.FEED_NOT_FOUND },
  })
  @UseGuards(JWTAuthGuard)
  @Post()
  reportFeeds(@Body() reportFeedsDto: ReportFeedsDto) {
    return this.reportsService.reportFeeds(reportFeedsDto);
  }
}
