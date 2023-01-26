import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import baseResponse from '../common/utils/baseResponseStatus';
import { sucResponse } from '../common/utils/response';
import { PostLikeRequestDTO } from './dto/post-like.dto';
import { LikesService } from './likes.service';

@Controller('likes')
@ApiTags('Feed API')
export class LikesController {
    constructor(private likesService:LikesService){};

    @Post()
    @ApiOperation({
        summary: '둘러보기 API 2.1.4 좋아요 설정/해제 기능',
        description: '둘러보기 탐색에서 화면에서 사용되는 API이다. 둘러보기 탐색중에 마음에드는 피드에 좋아요 버튼을 눌러 좋아요를 설정/해제 할 수 있다.\n\
                      좋아요상태에서는 좋아요 해제 되고 좋아요를 안한상태에서는 좋아요가 된다.'
    })
    @ApiResponse({
        status: 2000,
        description: '좋아요 설정',
        schema: { example: sucResponse(baseResponse.POST_LIKE) },
    })
    @ApiResponse({
        status: 2001,
        description: '좋아요 해제',
        schema: { example: sucResponse(baseResponse.DELETE_LIKE) },
    })
    postLikes(
        @Body() postLikeRequestDTO: PostLikeRequestDTO
    ){
        //유효한 profile인지 CHECK해야함.
        //유효한 Feed인지 check해야함.
        return this.likesService.postLikes(postLikeRequestDTO.feedId,postLikeRequestDTO.profileId);

    }
}
