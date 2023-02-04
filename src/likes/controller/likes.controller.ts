import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from '../../auth/security/auth.guard.jwt';
import baseResponse from '../../common/utils/baseResponseStatus';
import { sucResponse } from '../../common/utils/response';
import { PostLikeRequestDTO } from '../dto/post-like.dto';
import { LikesService } from '../service/likes.service';

@Controller('likes')
@ApiTags('Feed API')
export class LikesController {
    constructor(private likesService:LikesService){};

    @ApiOperation({
        summary: '둘러보기 API 2.1.4 좋아요 설정/해제 기능',
        description: '둘러보기 탐색에서 화면에서 사용되는 API이다. 둘러보기 탐색중에 마음에드는 피드에 좋아요 버튼을 눌러 좋아요를 설정/해제 할 수 있다.\n\
                      좋아요상태에서는 좋아요 해제 되고 좋아요를 안한상태에서는 좋아요가 된다.'
    })
    @ApiResponse({
        status:baseResponse.JWT_UNAUTHORIZED.statusCode,
        description:baseResponse.JWT_UNAUTHORIZED.message
    })
    @ApiResponse({
        status: baseResponse.POST_LIKE.statusCode,
        description: baseResponse.POST_LIKE.message,
        schema: { example: sucResponse(baseResponse.POST_LIKE) },
    })
    @ApiResponse({
        status: baseResponse.DELETE_LIKE.statusCode,
        description: baseResponse.DELETE_LIKE.message,
        schema: { example: sucResponse(baseResponse.DELETE_LIKE) },
    })
    @ApiResponse({
        status: baseResponse.PROFILE_ID_NOT_FOUND.statusCode,
        description: baseResponse.PROFILE_ID_NOT_FOUND.message,
    })
    @ApiResponse({
        status: baseResponse.FEED_NOT_FOUND.statusCode,
        description: baseResponse.FEED_NOT_FOUND.message,
    })
    @ApiResponse({
        status: baseResponse.DB_ERROR.statusCode,
        description: baseResponse.DB_ERROR.message,
    })
    @ApiBearerAuth('Authorization')
    @UseGuards(JWTAuthGuard)
    @Post()
    postLikes(
        @Body() postLikeRequestDTO: PostLikeRequestDTO
    ){
        
        return this.likesService.postLikes(postLikeRequestDTO.feedId,postLikeRequestDTO.profileId);

    }
}
