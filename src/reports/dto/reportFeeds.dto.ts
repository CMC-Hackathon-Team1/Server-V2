import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength } from "class-validator";

export class ReportFeedsDto {
  @ApiProperty({
    description: '신고 대상 게시물 feedId',
    example: 6,
    required: true
  })
  @IsNotEmpty()
  feedId: number;

  @ApiProperty({
    description: '신고 종류 (1 ~ 6)',
    example: 6,
    required: true
  })
  @IsNotEmpty()
  reportedCategoryId: number;

  @ApiProperty({
    description: 'reportedCategoryId가 6인 경우(기타 부적절한 글)에 신고 사유를 작성 (reportedCategoryId가 1 ~ 5인 경우는 content를 보내주지 않아도 됨)',
    example: '게시글이 이상해요',
    required: false
  })
  @MaxLength(20)
  content: string | null;
}