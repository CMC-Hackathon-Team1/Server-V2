import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { Feeds } from '../../common/entities/Feeds';
import { Feed, retrieveFeedsReturnDto } from '../dto/retreive-feeds-return.dto';
import { feedExploreValidationPipe } from '../validation/feeds.explore-validation-pipe';
import { FeedsService } from '../service/feeds.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { sucResponse } from '../../common/utils/response';
import baseResponse from '../../common/utils/baseResponseStatus';
import { MyFeed } from '../dto/retreive-my-feed-bymonth.dto';
import { JWTAuthGuard } from '../../auth/security/auth.guard.jwt';

@Controller('feeds')
@ApiTags('Feed API')
export class FeedsController {
    constructor(private feedsService:FeedsService){};
    @Get("/feedlist")
    @ApiCreatedResponse({
        status: 100,
        type: Feed,
        isArray: true,
        description: "성공했을때 response"
    })
    @ApiOperation({
        summary: '둘러보기 API 2.1.1',
        description: '둘러보기 탐색에서 사용되는 API이다. 카테고리 설정과 함께 작동한다.\n\
                      실패했을 때의 에러핸들링의 경우 추가로 업데이트될 예정이다.' ,
    })
    @ApiQuery({
        name: 'profileId',
        required:true,
        description:'현재 유저의 profileId'
    })
    @ApiQuery({
        name: 'page',
        required:true,
        description:'pagination을 통해 scroll하면서 10개씩 정보를 받아온다. 현재 몇번째 정보를 받아와야하는지를 넘겨주시면 됩니다.\n\
                      1~10번째 정보를 받아와야한다면 page=1, 11~20번째 피드를 받아와야한다면 page=2'
    })
    @ApiQuery({
        name: 'categoryId',
        required:true,
        description:'둘러보기할때 categoryId를 함께 보내주셔야합니다. 보내지 않으면 카테고리 전체 탐색이며 특정 카테고리만 원하는 경우 카테고리 id를 보내주셔야합니다.\n\
                     카테고리 id는 다음과 같습니다.\n\
                     0. 전체 ,1. 문화/예술 ,2. 스포츠, 3. 자기계발, 4. 기타'
    })
    RetreiveFeeds(
        @Query('profileId') profileId:number,
        @Query('page') pageNumber: number,
        @Query('categoryId') categoryId: number,
         ): Promise<retrieveFeedsReturnDto>{
        
        //TODO parameter validation 필수.
        //profileId가 유효한 id인지?
        //pageNumber가 유효한 number인지?
        //category는 유효한지?
        
        // console.log(profileId);
        // console.log(pageNumber);
        // console.log(categoryId);
        // console.log(option);

        return this.feedsService.RetreiveFeeds(profileId,pageNumber,categoryId);
    }

    @Get('/my-feeds/by-month')
    @ApiOperation({
        summary: '프로필 (게시글모아보기) API 3.1.2/기능명세서 1.4(1).1 해당일 게시글 모아보기',
        description: 'A: 프로필 (게시글모아보기) API 3.1.2: 마이페이지에서 월별 게시글 모아보기 기능이다. year과 month를 통해 그달에 포스팅한 게시글들을 모아볼 수 있다.\n\
                      pagination으로 동작한다.\
                      B: 기능명세서 1.4(1).1 해당일 게시글 모아보기 기능이다. 홈화면 달력에서 날짜를 클릭시 동작한다. year,month,day를 통해 해당일에 등록된 게시글을 조회한다.' ,
    })
    @ApiQuery({
        name: 'profileId',
        required:true,
        description:'현재 유저의 profileId ex)29'
    })
    @ApiQuery({
        name: 'year',
        required:true,
        description:'검색하고싶은 년도 "yyyy"형식으로 제공되어야한다.(4자리 수) ex) 2023'
    })
    @ApiQuery({
        name: 'month',
        required:true,
        description:'검색하고싶은 달 "mm"형식으로 제공되어야한다.(2자리수) ex) 01'
    })
    @ApiQuery({
        name: 'day',
        required:false,
        description:'프로필 (게시글모아보기) API 3.1.2 에선 사용되지 않는다. 기능명세서 1.4(1).1 해당일 게시글 모아보기에서만 사용된다.'
    })
    @ApiQuery({
        name: 'page',
        required:true,
        description:'pagination을 통해 scroll하면서 10개씩 정보를 받아온다. 현재 몇번째 정보를 받아와야하는지를 넘겨주시면 됩니다.\n\
                      1~10번째 정보를 받아와야한다면 page=1, 11~20번째 피드를 받아와야한다면 page=2'
    })
    @ApiCreatedResponse({
        status: 100,
        type: MyFeed,
        isArray: true,
        description: "성공했을때 response"
    })
    RetreiveMyFeedByMonth(
        @Query('profileId') profileId:number,
        @Query('year') year:number,
        @Query('month') month:number,
        @Query('day') day:number,
        @Query('page') pageNumber: number
    ){
        return this.feedsService.RetreiveMyFeedByMonth(profileId,year,month,day,pageNumber);
    }

    @Get('/my-feeds/in-calendar')
    @ApiOperation({
        summary: '홈화면(캘런더) 1.4.1',
        description: '홈화면에서 캘런더를 통해 내가 게시글을 쓴 날이 표시되는 API이다.' ,
    })
    @ApiQuery({
        name: 'profileId',
        required:true,
        description:'현재 유저의 profileId ex)29'
    })
    @ApiQuery({
        name: 'year',
        required:true,
        description:'검색하고싶은 년도 "yyyy"형식으로 제공되어야한다.(4자리 수) ex) 2023'
    })
    @ApiQuery({
        name: 'month',
        required:true,
        description:'검색하고싶은 달 "mm"형식으로 제공되어야한다.(2자리수) ex) 01'
    })
    RetriveMyFeedInCalender(
        @Query('profileId') profileId:number,
        @Query('year') year:number,
        @Query('month') month:number
    ){
        console.log("아 쫌!!");
        return this.feedsService.RetriveMyFeedInCalender(profileId,year,month);
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
}
