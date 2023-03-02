import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from '../../auth/security/auth.guard.jwt';
import baseResponse from '../../common/utils/baseResponseStatus';
import { ReportFeedsDto } from '../dto/reportFeeds.dto';
import { ReportsService } from '../service/reports.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(
    private reportsService: ReportsService
  ) {}

  
  // API No. 2.5 게시글 신고하기
  @ApiOperation({
    summary: '게시글 신고하기',
    description:
      'API No. 2.5 게시글 신고하기에 해당하는 API이며 요청 Body에 있는 feedId를 이용해 해당 게시글의 status를 REPORTED 상태로 변경한다.\n\nreportedCategoryId 목록\n\n1. 스팸 및 홍보글\n\n2. 음란성이 포함된 글\n\n3. 욕설/생명경시/혐오/차별적인 글\n\n4. 게시글 도배\n\n5. 개인정보 노출 및 불법 정보\n\n6. 기타 부적절한 글\n\n각 신고 내용에 맞는 숫자(1~6)을 reportedCategoryId에 담아서 보내주시면 됩니다.\n\n6번에 해당하는 경우 content를 꼭 보내주시기 바랍니다.\n\n6을 제외한 reportedCategoryId와 content가 함께 전송된다면 content는 무시되므로 1 ~ 5에 해당하는 경우 content 필드는 보내주지 않으셔도 됩니다.'
  })
  @ApiBearerAuth('Authorization')
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
  @ApiResponse({
    status: 3000,
    description: '게시글이 이미 신고된 경우',
    schema: { example: baseResponse.FEED_ALREADY_REPORTED },
  })
  @ApiResponse({
    status: 3001,
    description: '신고 분류가 올바르지 않은 경우 (1 ~ 6의 범위를 벗어나는 경우)',
    schema: { example: baseResponse.INVALID_REPORT_CATEGORY },
  })
  @UseGuards(JWTAuthGuard)
  @Post()
  reportFeeds(@Body() reportFeedsDto: ReportFeedsDto) {
    return this.reportsService.reportFeeds(reportFeedsDto);
  }
}
