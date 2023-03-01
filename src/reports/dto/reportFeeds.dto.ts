import { ApiProperty } from "@nestjs/swagger";

export class ReportFeedsDto {
  @ApiProperty()
  reportedCategoryId: number;

  @ApiProperty()
  feedId: number;

  @ApiProperty()
  content: string | null;
}