export class SaveReportsDto {
  constructor(reportedCategoryId: number, userId: number, feedId: number, contentId?:number) {
    this.reportedCategoryId = reportedCategoryId;
    this.userId = userId;
    this.feedId = feedId;
    this.contentId = contentId;
  }

  reportedCategoryId: number;
  userId: number;
  feedId: number;
  contentId: number | null;
}