import { Injectable } from '@nestjs/common';
import baseResponse from '../../common/utils/baseResponseStatus';
import { errResponse, sucResponse } from '../../common/utils/response';
import { ReportFeedsDto } from '../dto/reportFeeds.dto';
import { FeedRepository } from '../../feeds/feeds.repository';
import { ReportsRepository } from '../reports.repository';
import { ProfilesRepository } from '../../profiles/profiles.repository';

@Injectable()
export class ReportsService {
  constructor(
    private reportsRepository: ReportsRepository,
    private feedRepository: FeedRepository,
    private profilesRepository: ProfilesRepository,
  ) {}

  // 게시글 신고하기
  async reportFeeds(reportFeedsDto: ReportFeedsDto) {
    try {
      const targetFeedId = reportFeedsDto.feedId;
      const reportCategoryId = reportFeedsDto.reportCategoryId;
      const reportContent = reportFeedsDto.content;

      // TODO: Profiles Repository에서 profile에 해당하는 userId 가져오기 메소드 구현

      if (reportCategoryId === 6) {
        const saveReportContentResult = await this.reportsRepository.saveReportContent(reportContent);
        const contentId = saveReportContentResult.contentId;
      }

      const changeFeedStatus = await this.feedRepository.reportFeeds(targetFeedId);

      return sucResponse(baseResponse.SUCCESS);
    } catch (error) {
      return errResponse(baseResponse.DB_ERROR);
    }
  }

}
