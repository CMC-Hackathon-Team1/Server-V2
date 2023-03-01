import { ApiProperty } from "@nestjs/swagger";

export class ReportFeedsDto {
  @ApiProperty()
  reportCategoryId: number;

  @ApiProperty()
  feedId: number;

  @ApiProperty()
  content: string | null;
}