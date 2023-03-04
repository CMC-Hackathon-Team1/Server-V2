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

      const targetFeed = await this.feedRepository.checkFeedReported(feedId);

      if (!targetFeed) {
        return errResponse(baseResponse.FEED_NOT_FOUND);
      }
      const targetFeedStatus = targetFeed.status;

      if (targetFeedStatus === 'REPORTED') {
        return errResponse(baseResponse.FEED_ALREADY_REPORTED);
      }

      if (reportFeedsDto.reportedCategoryId < 1 || 6 < reportFeedsDto.reportedCategoryId) {
        return errResponse(baseResponse.INVALID_REPORT_CATEGORY);
      }

      const getUserIdByFeedIdResult = await this.feedRepository.getUserIdByFeedId(feedId);
      const userId = getUserIdByFeedIdResult.userId;
      const reportedCategoryId = reportFeedsDto.reportedCategoryId;
      const reportContent = reportFeedsDto.content;

      if (reportedCategoryId === 6) {
        if (!reportContent) {
          return errResponse(baseResponse.REPORT_CONTENT_EMPTY);
        }
        
        const saveReportContentResult = await this.reportsRepository.saveReportContent(reportContent);
        const contentId = saveReportContentResult.contentId;
        const saveReportsDto = new SaveReportsDto(reportedCategoryId, userId, feedId, contentId);

        const changeFeedStatus = await this.feedRepository.reportFeeds(feedId);
        const reportResult = await this.reportsRepository.saveReport(saveReportsDto);

        return sucResponse(baseResponse.SUCCESS);
      }
      
      const saveReportsDto = new SaveReportsDto(reportedCategoryId, userId, feedId);

      const changeFeedStatus = await this.feedRepository.reportFeeds(feedId);
      const reportResult = await this.reportsRepository.saveReport(saveReportsDto);

      return sucResponse(baseResponse.SUCCESS);
    } catch (error) {
      console.log(error)
      return errResponse(baseResponse.DB_ERROR);
    }
  }

}
