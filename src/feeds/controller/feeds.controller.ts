import {
  Bind,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Feeds } from '../../common/entities/Feeds';
import { feedExploreValidationPipe } from '../validation/feeds.explore-validation-pipe';
import { FeedsService } from '../service/feeds.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { errResponse, sucResponse } from '../../common/utils/response';
import baseResponse from '../../common/utils/baseResponseStatus';
import { MyFeed } from '../dto/retreive-my-feed-bymonth.dto';
import { JWTAuthGuard } from '../../auth/security/auth.guard.jwt';
import { PostFeedRequestDTO } from '../dto/post-feed-request.dto';
import { PatchFeedRequestDTO } from '../dto/patch-feed-request.dto';
import { FeedSecret } from '../enum/feed-secret-enum';
import { AuthGuard } from '@nestjs/passport';
import { DeleteFeedDTO } from '../dto/delete-feed-request.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AwsService } from '../../aws/aws.service';
import { Feed, retrieveFeedListDto } from '../dto/retrieve-feedList.dto';

@Controller('feeds')
@ApiTags('Feed API')
export class FeedsController {
  constructor(
    private feedsService: FeedsService,
    private readonly AwsService: AwsService,
  ) {}

  @ApiCreatedResponse({
    status: 100,
    type: Feed,
    isArray: true,
    description: '성공했을때 response. 게시물 결과가 하나도 없는 경우도 성공이다.',
  })
  @ApiOperation({
    summary: '2.1.1. 타유저(탐색) 게시글 피드',
    description:
      '둘러보기 탐색에서 사용되는 API이다. 카테고리 설정과 함께 작동한다.\n\
                      실패했을 때의 에러핸들링의 경우 추가로 업데이트될 예정이다.',
  })
  @ApiBody({
    schema: {
      properties: {
        profileId: { type: 'number' },
      },
      example: {
        profileId: 27,
      },
    },
    required: true,
    description: '현재 유저의 profileId',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description:
      'pagination을 통해 scroll하면서 10개씩 정보를 받아온다. 현재 몇번째 정보를 받아와야하는지를 넘겨주시면 됩니다.\n\
                      1~10번째 정보를 받아와야한다면 page=1, 11~20번째 피드를 받아와야한다면 page=2',
  })
  @ApiQuery({
    name: 'categoryId',
    required: true,
    description:
      'categoryId를 받아내기 위해서는 Category API의 카테고리 목록 가져오기 API를 사용하시면 됩니다.\
      0을 보낼 경우 category필터링 없이 전체 피드를 탐색합니다',
  })
  // @ApiResponse({
  //   status: baseResponse.FEED_NOT_FOUND.statusCode,
  //   description: baseResponse.FEED_NOT_FOUND.message,
  // })
  @ApiBearerAuth('Authorization')
  @Get('/feedlist')
  @UseGuards(JWTAuthGuard)
  RetrieveFeeds(
    @Body('profileId') profileId: number,
    @Query('page') pageNumber: number,
    @Query('categoryId') categoryId: number,
  ): Promise<retrieveFeedListDto> {
    //TODO parameter validation 필수.
    //profileId가 유효한 id인지?
    //pageNumber가 유효한 number인지?
    //category는 유효한지?

    // console.log(profileId);
    // console.log(pageNumber);
    // console.log(categoryId);
    // console.log(option);
    // console.log(profileId);
    // console.log(pageNumber);
    // console.log(categoryId);
    // console.log(option);

    return this.feedsService.RetrieveFeeds(profileId, pageNumber, categoryId, false);
  }

  @ApiCreatedResponse({
    status: 100,
    type: Feed,
    isArray: true,
    description: '성공했을때 response. 게시물 결과가 하나도 없는 경우도 성공이다.',
  })
  @ApiOperation({
    summary: '2.2.1. 타유저(팔로잉) 게시글 피드',
    description:
      '둘러보기 팔로잉에서 사용되는 API이다. 카테고리 설정과 함께 작동한다.\n\
                      실패했을 때의 에러핸들링의 경우 추가로 업데이트될 예정이다.',
  })
  @ApiBody({
    schema: {
      properties: {
        profileId: { type: 'number' },
      },
      example: {
        profileId: 27,
      },
    },
    required: true,
    description: '현재 유저의 profileId',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description:
      'pagination을 통해 scroll하면서 10개씩 정보를 받아온다. 현재 몇번째 정보를 받아와야하는지를 넘겨주시면 됩니다.\n\
                      1~10번째 정보를 받아와야한다면 page=1, 11~20번째 피드를 받아와야한다면 page=2',
  })
  @ApiQuery({
    name: 'categoryId',
    required: true,
    description:
      'categoryId를 받아내기 위해서는 Category API의 카테고리 목록 가져오기 API를 사용하시면 됩니다.\
      0을 보낼 경우 category필터링 없이 전체 피드를 탐색합니다',
  })
  @ApiBearerAuth('Authorization')
  @Get('/feedlist-following')
  @UseGuards(JWTAuthGuard)
  RetrieveFollowingFeeds(
    @Body('profileId') profileId: number,
    @Query('page') pageNumber: number,
    @Query('categoryId') categoryId: number,
  ): Promise<retrieveFeedListDto> {
    //TODO parameter validation 필수.
    //profileId가 유효한 id인지?
    //pageNumber가 유효한 number인지?
    //category는 유효한지?

    // console.log(profileId);
    // console.log(pageNumber);
    // console.log(categoryId);
    // console.log(option);
    // console.log(profileId);
    // console.log(pageNumber);
    // console.log(categoryId);
    // console.log(option);

    return this.feedsService.RetrieveFeeds(profileId, pageNumber, categoryId, true);
  }

  @ApiOperation({
    summary:
      '프로필 (게시글모아보기) API 3.1.2/기능명세서 1.4(1).1 해당일 게시글 모아보기',
    description:
      'A: 프로필 (게시글모아보기) API 3.1.2: 마이페이지에서 월별 게시글 모아보기 기능이다. year과 month를 통해 그달에 포스팅한 게시글들을 모아볼 수 있다.\n\
                      pagination으로 동작한다.\
                      B: 기능명세서 1.4(1).1 해당일 게시글 모아보기 기능이다. 홈화면 달력에서 날짜를 클릭시 동작한다. year,month,day를 통해 해당일에 등록된 게시글을 조회한다.',
  })
  @ApiQuery({
    name: 'profileId',
    required: true,
    description: '현재 유저의 profileId ex)29',
  })
  @ApiQuery({
    name: 'year',
    required: true,
    description:
      '검색하고싶은 년도 "yyyy"형식으로 제공되어야한다.(4자리 수) ex) 2023',
  })
  @ApiQuery({
    name: 'month',
    required: true,
    description: '검색하고싶은 달 "mm"형식으로 제공되어야한다.(2자리수) ex) 01',
  })
  @ApiQuery({
    name: 'day',
    required: false,
    description:
      '프로필 (게시글모아보기) API 3.1.2 에선 사용되지 않는다. 기능명세서 1.4(1).1 해당일 게시글 모아보기에서만 사용된다.',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description:
      'pagination을 통해 scroll하면서 10개씩 정보를 받아온다. 현재 몇번째 정보를 받아와야하는지를 넘겨주시면 됩니다.\n\
                      1~10번째 정보를 받아와야한다면 page=1, 11~20번째 피드를 받아와야한다면 page=2',
  })
  @ApiCreatedResponse({
    status: 100,
    type: MyFeed,
    isArray: true,
    description: '성공했을때 response',
  })
  @ApiBearerAuth('Authorization')
  @Get('/my-feeds/by-month')
  @UseGuards(JWTAuthGuard)
  RetreiveMyFeedByMonth(
    @Query('profileId') profileId: number,
    @Query('year') year: number,
    @Query('month') month: number,
    @Query('day') day: number,
    @Query('page') pageNumber: number,
  ) {
    return this.feedsService.RetreiveMyFeedByMonth(
      profileId,
      year,
      month,
      day,
      pageNumber,
    );
  }

  @ApiOperation({
    summary: '특정 feed 상세보기 API',
  })

  @ApiBearerAuth('Authorization')
  @UseGuards(JWTAuthGuard)
  @Get('/:feedId/profiles/:profileId')
  getFeedById(@Param('feedId') feedId:number,@Param('profileId') profileId:number){
    return this.feedsService.getFeedById(feedId,profileId);
  }

  @ApiOperation({
    summary: '게시글 생성 API 기능명세서 1.3',
    description:
      '게시글 생성 API 이다. 해시태그는 최대 20개 img는 최대 5개까지 가능하다.(디스코드 질문!? 채널 참고)\
      모든 데이터는 from-data형태로 전달해야하며 images는 File, 나머지 데이터는 TEXT로 전달하면 된다.\
      categoryId의 경우 GET Category API를 통해 받아와서 사용해야한다.. hashTagList는 배열형태로 전달한다. 다만 해시태그가 하나일경우 string형태로 전달하더라도\
      내부에서 배열로 바꿔 처리될 수 있도록 구현되어있다. 편한 방법대로 구현하시면 됩니다. content의 최대길이는 2000자로 2000자가 넘으면 errResponse가 발생합니다.\
      isSecret의 경우 PUBLIC(공개),PRIVATE(비공개)중 하나를 전송해야하며 대문자로 전송해야 합니다.\
      피드 이미지의 경우 "images" 키 이름으로 전송해야 한다.\
      form-data형태로 보내야 하기 때문에 POST MAN에서 테스트하셔야합니다.',
  })
  @ApiResponse({
    status: baseResponse.SUCCESS.statusCode,
    description: baseResponse.SUCCESS.message,
  })
  @ApiResponse({
    status: 400,
    description: 'ooo should not be empty',
  })
  @ApiResponse({
    status: baseResponse.FEED_CAN_HAVE_20_HASHTAGS.statusCode,
    description: baseResponse.FEED_CAN_HAVE_20_HASHTAGS.message,
  })
  @ApiResponse({
    status: baseResponse.FEED_IMG_COUNT_OVER.statusCode,
    description: baseResponse.FEED_IMG_COUNT_OVER.message,
  })
  @ApiResponse({
    status: baseResponse.DB_ERROR.statusCode,
    description: baseResponse.DB_ERROR.message,
  })
  @ApiResponse({
    status: baseResponse.FEED_HAVE_CONTENT_OR_IMAGE.statusCode,
    description: baseResponse.FEED_HAVE_CONTENT_OR_IMAGE.message,
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JWTAuthGuard)
  @Post('/')
  @UseInterceptors(FilesInterceptor('images'))
  @UsePipes(ValidationPipe)
  PostFeed(
    @Body() postFeedRequestDTO: PostFeedRequestDTO,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    if (typeof postFeedRequestDTO.hashTagList == 'string') {
      postFeedRequestDTO.hashTagList = [postFeedRequestDTO.hashTagList];
    }
    if (postFeedRequestDTO.hashTagList.length > 20) {
      return errResponse(baseResponse.FEED_CAN_HAVE_20_HASHTAGS);
    }
    if (!postFeedRequestDTO.content && !images) {
      return errResponse(baseResponse.FEED_HAVE_CONTENT_OR_IMAGE);
    }
    if (images.length > 5) {
      return errResponse(baseResponse.FEED_IMG_COUNT_OVER);
    }
    return this.feedsService.postFeed(postFeedRequestDTO, images);
  }

  @ApiOperation({
    summary: '게시글 수정 API 1.4.2',
    description:
      '게시글 수정에 사용되는 API이다. 수정한 자료만 서버로 전달하는것이 아닌 모든 정보를 서버로 전달해줘야한다.',
  })
  @ApiResponse({
    status: baseResponse.SUCCESS.statusCode,
    description: baseResponse.SUCCESS.message,
  })
  @ApiResponse({
    status: baseResponse.JWT_UNAUTHORIZED.statusCode,
    description: baseResponse.JWT_UNAUTHORIZED.message,
  })
  @ApiResponse({
    status: baseResponse.FEED_CONTENT_TO_MANY_CHARACTERS.statusCode,
    description: baseResponse.FEED_CONTENT_TO_MANY_CHARACTERS.message,
  })
  @ApiResponse({
    status: baseResponse.FEED_IS_SECRET_CAN_HAVE_PUBLIC_OR_PRIVATE.statusCode,
    description: baseResponse.FEED_IS_SECRET_CAN_HAVE_PUBLIC_OR_PRIVATE.message,
  })
  @ApiResponse({
    status: baseResponse.FEED_NOT_FOUND.statusCode,
    description: baseResponse.FEED_NOT_FOUND.message,
  })
  @ApiResponse({
    status: baseResponse.FEED_NO_AUTHENTICATION.statusCode,
    description: baseResponse.FEED_NO_AUTHENTICATION.message,
  })
  @ApiResponse({
    status: baseResponse.DB_ERROR.statusCode,
    description: baseResponse.DB_ERROR.message,
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JWTAuthGuard)
  @Patch('/')
  PatchFeed(@Body() patchFeedRequestDTO: PatchFeedRequestDTO) {
    console.log('patch 실행');
    if (patchFeedRequestDTO.content.length > 2000) {
      return errResponse(baseResponse.FEED_CONTENT_TO_MANY_CHARACTERS);
    }
    if (
      patchFeedRequestDTO.isSecret != FeedSecret.PUBLIC &&
      patchFeedRequestDTO.isSecret != FeedSecret.PRIVATE
    ) {
      return errResponse(
        baseResponse.FEED_IS_SECRET_CAN_HAVE_PUBLIC_OR_PRIVATE,
      );
    }
    return this.feedsService.patchFeed(patchFeedRequestDTO);
  }

  @ApiOperation({
    summary: '게시글 삭제하기 API 1.4(1).2',
    description: '게시글 삭제하기 API.',
  })
  @ApiResponse({
    status: baseResponse.SUCCESS.statusCode,
    description: baseResponse.SUCCESS.message,
  })
  @ApiResponse({
    status: baseResponse.PROFILE_NOT_EXIST.statusCode,
    description: baseResponse.PROFILE_NOT_EXIST.message,
  })
  @ApiResponse({
    status: baseResponse.FEED_NOT_FOUND.statusCode,
    description: baseResponse.FEED_NOT_FOUND.message,
  })
  @ApiResponse({
    status: baseResponse.FEED_NO_AUTHENTICATION.statusCode,
    description: baseResponse.FEED_NO_AUTHENTICATION.message,
  })
  @ApiResponse({
    status: baseResponse.DB_ERROR.statusCode,
    description: baseResponse.DB_ERROR.message,
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JWTAuthGuard)
  @Patch('/status')
  deleteFeed(@Body() deleteFeedDTO: DeleteFeedDTO) {
    return this.feedsService.deleteFeed(deleteFeedDTO);
  }

  @ApiOperation({
    summary: '홈화면(캘런더) 1.4.1',
    description:
      '홈화면에서 캘런더를 통해 내가 게시글을 쓴 날이 표시되는 API이다.',
  })
  @ApiQuery({
    name: 'profileId',
    required: true,
    description: '현재 유저의 profileId ex)29',
  })
  @ApiQuery({
    name: 'year',
    required: true,
    description:
      '검색하고싶은 년도 "yyyy"형식으로 제공되어야한다.(4자리 수) ex) 2023',
  })
  @ApiQuery({
    name: 'month',
    required: true,
    description: '검색하고싶은 달 "mm"형식으로 제공되어야한다.(2자리수) ex) 01',
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JWTAuthGuard)
  @Get('/my-feeds/in-calendar')
  RetriveMyFeedInCalender(
    @Query('profileId') profileId: number,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    console.log('아 쫌!!');
    return this.feedsService.RetriveMyFeedInCalender(profileId, year, month);
  }

  // API No. 2.5 게시글 신고하기
  @ApiOperation({
    summary: '게시글 신고하기',
    description:
      'API No. 2.5 게시글 신고하기에 해당하는 API이며 요청 Body에 있는 feedId를 이용해 해당 게시글의 status를 REPORTED 상태로 변경한다.',
  })
  @ApiBearerAuth('Authorization')
  @ApiBody({ schema: { example: { feedId: 1 } } })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: { example: baseResponse.SUCCESS },
  })
  @ApiResponse({
    status: 400,
    description: 'Parameter 오류',
    schema: { example: baseResponse.PIPE_ERROR_EXAMPLE },
  })
  @ApiResponse({
    status: 401,
    description: 'JWT 오류',
    schema: { example: baseResponse.JWT_UNAUTHORIZED },
  })
  @ApiResponse({
    status: 501,
    description: 'DB 오류',
    schema: { example: baseResponse.DB_ERROR },
  })
  @ApiResponse({
    status: 2200,
    description: '해당 Feed가 존재하지 않는 경우',
    schema: { example: baseResponse.FEED_NOT_FOUND },
  })
  @UseGuards(JWTAuthGuard)
  @Post('/report')
  reportFeeds(@Body('feedId', ParseIntPipe) feedId: number) {
    return this.feedsService.reportFeeds(feedId);
  }

  // API No. 2.3.1 해시태그 검색
  // @UseGuards(JWTAuthGuard)
  // @Get('/feedlist/:profileId/search')
  // searchFeeds(
  //   @Param('profileId', ParseIntPipe) profileId: number,
  //   @Query('hashtag') hashtag: string,
  //   @Query('page') pageNumber: number,
  //   @Query('categoryId') categoryId: number,) {
  //   // [Validation 처리]
  //   // profileId 가 있는가
  //   if (!profileId) {
  //     return errResponse(baseResponse.PROFILE_ID_NOT_FOUND);
  //   }
  //   // jwt 토큰 유저 정보와 profileId 가 맞게 매칭되어 있는가
  //   // const checkProfileMatch = await this.statisticsService.checkProfile(user.userId, profileId);
  //   // console.log(checkProfileMatch);
  //
  //   // if (!checkProfileMatch) {
  //   //   return errResponse(baseResponse.PROFILE_NOT_MATCH);
  //   // }
  //   // 해시태그가 있는가
  //   if (!hashtag) {
  //     return errResponse(baseResponse.HASHTAG_NOT_FOUND);
  //   }
  //   // ---
  //
  //   return this.feedsService.searchFeedsByHashtag(hashtag);
  // }
}
