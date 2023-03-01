import { Injectable } from '@nestjs/common';
import baseResponse from '../../common/utils/baseResponseStatus';
import { errResponse, sucResponse } from '../../common/utils/response';
import { ReportFeedsDto } from '../dto/reportFeeds.dto';
import { FeedRepository } from '../../feeds/feeds.repository';
import { ReportsRepository } from '../reports.repository';
import { ProfilesRepository } from '../../profiles/profiles.repository';
import { SaveReportsDto } from '../dto/saveReports.dto';

@Injectable()
export class ReportsService {
  constructor(
    private reportsRepository: ReportsRepository,
    private feedRepository: FeedRepository,
  ) {}

  // 게시글 신고하기
  async reportFeeds(reportFeedsDto: ReportFeedsDto) {
    try {
      const feedId = reportFeedsDto.feedId;
      const getUserIdByFeedIdResult = await this.feedRepository.getUserIdByFeedId(feedId);
      const userId = getUserIdByFeedIdResult.userId;
      const reportedCategoryId = reportFeedsDto.reportedCategoryId;
      const reportContent = reportFeedsDto.content;

      if (reportedCategoryId === 6) {
        const saveReportContentResult = await this.reportsRepository.saveReportContent(reportContent);
        const contentId = saveReportContentResult.contentId;
        const saveReportsDto = new SaveReportsDto(reportedCategoryId, userId, feedId, contentId);
        console.log(saveReportsDto)

        const changeFeedStatus = await this.feedRepository.reportFeeds(feedId);
        const reportResult = await this.reportsRepository.saveReport(saveReportsDto);

        return sucResponse(baseResponse.SUCCESS);
      }
      
      const saveReportsDto = new SaveReportsDto(reportedCategoryId, userId, feedId);
      console.log(saveReportsDto)

      const changeFeedStatus = await this.feedRepository.reportFeeds(feedId);
      const reportResult = await this.reportsRepository.saveReport(saveReportsDto);

      return sucResponse(baseResponse.SUCCESS);
    } catch (error) {
      console.log(error)
      return errResponse(baseResponse.DB_ERROR);
    }
  }

}
