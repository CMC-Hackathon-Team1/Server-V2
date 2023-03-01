import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReportContent } from "../common/entities/ReportContent";
import { Reports } from "../common/entities/Reports";
import { SaveReportsDto } from "./dto/saveReports.dto";

@Injectable()
export class ReportsRepository {
  constructor(
    @InjectRepository(Reports)
    private reportsTable: Repository<Reports>,

    @InjectRepository(ReportContent)
    private reportContentTable: Repository<ReportContent>,
  ) {}

  // 게시글 신고 카테고리가 '기타'인 경우 신고 사유 저장
  async saveReportContent(reportContent: string) {
    return await this.reportContentTable.save({ content: reportContent });
  }

  // 게시글 신고 저장
  async saveReport(saveReportsDto: SaveReportsDto) {
    return await this.reportsTable.save(saveReportsDto);
  }
}