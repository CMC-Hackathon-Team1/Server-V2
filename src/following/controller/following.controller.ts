import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTAuthGuard } from '../../auth/security/auth.guard.jwt';
import baseResponse from '../../common/utils/baseResponseStatus';
import { sucResponse } from '../../common/utils/response';
import { PostFollowRequestDTO } from '../dto/post-follow.dto';
import { FollowingService } from '../service/following.service';

@Controller('follow')
@ApiTags('Feed API')
export class FollowingController {
  constructor(private followingService: FollowingService) {}

  @ApiOperation({
    summary:
      '2.1.3. 탐색 게시글 팔로잉, 2.2.2. 팔로잉 게시글 팔로잉 - 팔로잉 설정/해제 기능',
    description:
      '둘러보기 탐색/팔로잉에서 사용되는 API이다. 둘러보기 게시물들 중에 마음에드는 프로필에 팔로우 설정/해제 할 수 있다.\n\
                      팔로우 상태에서는 팔로우가 해제 되고 팔로우를 안한 상태에서는 팔로우 상태가 된다.',
  })
  @ApiResponse({
    status: baseResponse.JWT_UNAUTHORIZED.statusCode,
    description: baseResponse.JWT_UNAUTHORIZED.message,
  })
  @ApiResponse({
    status: baseResponse.POST_FOLLOW.statusCode,
    description: baseResponse.POST_FOLLOW.message,
    schema: { example: sucResponse(baseResponse.POST_FOLLOW) },
  })
  @ApiResponse({
    status: baseResponse.DELETE_FOLLOW.statusCode,
    description: baseResponse.DELETE_FOLLOW.message,
    schema: { example: sucResponse(baseResponse.DELETE_FOLLOW) },
  })
  @ApiResponse({
    status: baseResponse.FROM_PROFILE_ID_NOT_FOUND.statusCode,
    description: baseResponse.FROM_PROFILE_ID_NOT_FOUND.message,
    schema: { example: sucResponse(baseResponse.POST_FOLLOW) },
  })
  @ApiResponse({
    status: baseResponse.TO_PROFILE_ID_NOT_FOUND.statusCode,
    description: baseResponse.TO_PROFILE_ID_NOT_FOUND.message,
    schema: { example: sucResponse(baseResponse.POST_FOLLOW) },
  })
  @ApiResponse({
    status: baseResponse.DB_ERROR.statusCode,
    description: baseResponse.DB_ERROR.message,
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JWTAuthGuard)
  @Post()
  postFollow(@Body() postFollowRequestDTO: PostFollowRequestDTO) {
    //following follower 유효한지 체크해야함.

    return this.followingService.postFollow(
      postFollowRequestDTO.fromProfileId,
      postFollowRequestDTO.toProfileId,
    );
  }

  @ApiOperation({
    summary:
      'Follow 여부 Test API입니다.',
    description:
      '포도님 건의로 만들어진 Test API입니다. postFollow와 같은 방식으로 요청하되 실제로 follow를 직접 진행하지는 않고 follow여부만 리턴됩니다.',
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JWTAuthGuard)
  @Post("/test")
  testFollow(@Body() postFollowRequestDTO: PostFollowRequestDTO){

    return this.followingService.postTestFollow(
      postFollowRequestDTO.fromProfileId,
      postFollowRequestDTO.toProfileId,
    );
  }
}
