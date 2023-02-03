import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import baseResponse from '../../common/utils/baseResponseStatus';
import { CategoriesService } from '../service/categories.service';

@Controller('categories')
@ApiTags('Category API')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @ApiOperation({
    summary: '카테고리 목록 가져오기 API',
    description:
      '게시글 생성/수정,둘러보기 등에서 카테고리 id가 필요할 때 위 API를 이용해서 categoryId와 categoryName을 흭득한다.',
  })
  @ApiResponse({
    status: baseResponse.SUCCESS.statusCode,
    description: baseResponse.SUCCESS.message,
  })
  @ApiResponse({
    status: baseResponse.DB_ERROR.statusCode,
    description: baseResponse.DB_ERROR.message,
  })
  @Get('/categories')
  GetCategories() {
    return this.categoryService.GetCategories();
  }
}
