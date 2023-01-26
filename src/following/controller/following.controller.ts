import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import baseResponse from '../../common/utils/baseResponseStatus';
import { sucResponse } from '../../common/utils/response';
import { PostFollowRequestDTO } from '../dto/post-follow.dto';
import { FollowingService } from '../service/following.service';

@Controller('follow')
@ApiTags('Feed API')
export class FollowingController {
    constructor(private followingService:FollowingService){};

    @Post()
    @ApiOperation({
        summary: '둘러보기 API 2.1.3 팔로잉 설정/해제 기능',
        description: '둘러보기 탐색에서 화면에서 사용되는 API이다. 둘러보기 탐색중에 마음에드는 프로필에 팔로우 설정/해제 할 수 있다.\n\
                      팔로우상태에서는 팔로우가 해제 되고 팔로우를 안한상태에서는 팔로우상태가 된다.'
    })
    @ApiResponse({
        status: 2101,
        description: '팔로우 설정',
        schema: { example: sucResponse(baseResponse.POST_FOLLOW) },
    })
    @ApiResponse({
        status: 2102,
        description: '팔로우 해제',
        schema: { example: sucResponse(baseResponse.DELETE_FOLLOW) },
    })
    postFollow(
        @Body() postFollowRequestDTO:PostFollowRequestDTO
    ){
        //following follower 유효한지 체크해야함.

        return this.followingService.postFollow(postFollowRequestDTO.fromProfileId,postFollowRequestDTO.toProfileId);

    }
}
