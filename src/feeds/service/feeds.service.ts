import { Injectable } from '@nestjs/common';
import { getDataSourceName, InjectRepository } from '@nestjs/typeorm';
import { LikesRepository } from '../../likes/likes.repository';
import { Feeds } from '../../common/entities/Feeds';
import { Feed, retrieveFeedsReturnDto } from '../dto/retreive-feeds-return.dto';
import { RetreiveMyFeedByMonthReturnDTO } from '../dto/retreive-my-feed-bymonth.dto';
import { FeedRepository } from '../feeds.repository';
import { RetreiveMyFeedInCalendarReturnDTO } from '../dto/retrive-my-feed-in-calendar.dto';
import { errResponse, sucResponse } from '../../common/utils/response';
import baseResponse from '../../common/utils/baseResponseStatus';
import { ProfilesRepository } from '../../profiles/profiles.repository';
import { Profiles } from '../../common/entities/Profiles';
import { PatchFeedRequestDTO } from '../dto/patch-feed-request.dto';
import { FeedHashTagMapping } from '../../common/entities/FeedHashTagMapping';
import { HashTagRepository } from '../../hash-tag/hashTag.repository';
import { HashTags } from '../../common/entities/HashTags';
import { hashTagFeedMappingRepository } from '../../hash-tag-feed-mapping/hash-tag-feed-mapping.repository';
import { DataSource } from 'typeorm';
import { DeleteFeedDTO } from '../dto/delete-feed-request.dto';
import { PostFeedRequestDTO } from '../dto/post-feed-request.dto';
import { AwsService } from '../../aws/aws.service';
import { FeedImgs } from '../../common/entities/FeedImgs';
import { FeedImgsRepository } from '../feedImgs.repository';
import { retrieveFeedListDto } from '../dto/retrieve-feedList.dto';
import { GetFeedByIdResDTO } from '../dto/get-feed-byId.dto';
import { FollowFromTo } from '../../common/entities/FollowFromTo';
import { ReportFeedsDto } from '../dto/reportFeeds.dto';

const util = require('util');

@Injectable()
export class FeedsService {
  constructor(
    private feedRepsitory: FeedRepository,
    private likeRepository: LikesRepository,
    private profileRepository: ProfilesRepository,
    private hashTagRepository: HashTagRepository,
    private hashTagFeedMappingRepository: hashTagFeedMappingRepository,
    private feedImgRepository: FeedImgsRepository,
    private dataSource: DataSource,
    private readonly AwsService: AwsService,
  ) {}

  async getFeedById(feedId: number, profileId: number) {
    try {
      const feedEntity: Feeds = await this.feedRepsitory.findFeedById(
        feedId,
        profileId,
      );
      if (!feedEntity) {
        return errResponse(baseResponse.FEED_NOT_FOUND);
      }
      const isLikeQueryResult = await this.likeRepository.isLike(
        [feedId],
        profileId,
      );
      let isLike = false;

      if (isLikeQueryResult.length > 0) {
        isLike = true;
      } else if (isLikeQueryResult.length == 0) {
        isLike = false;
      }

      const getFeedByIdResDTO: GetFeedByIdResDTO = new GetFeedByIdResDTO(
        feedEntity,
        isLike,
      ); //isLike처리해야함.
      return getFeedByIdResDTO;
    } catch (err) {
      return errResponse(baseResponse.DB_ERROR);
    }
  }
  async patchFeed(patchFeedRequestDTO: PatchFeedRequestDTO) {
    // feedId를 통해 feedEntity가져옴. + save로 수정함.
    console.log('findOne');
    const feedEntity: Feeds = await this.feedRepsitory.findOne(
      patchFeedRequestDTO.feedId,
    );
    if (!feedEntity) {
      console.log(feedEntity);
      return errResponse(baseResponse.FEED_NOT_FOUND);
    }
    if (feedEntity.profileId != patchFeedRequestDTO.profileId) {
      console.log(feedEntity.profileId);
      return errResponse(baseResponse.FEED_NO_AUTHENTICATION);
    }
    //TODO 로그인된 userId가 profileId와 일치하는가.
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const result = await this.feedRepsitory.update(patchFeedRequestDTO);

      const originHashTagMappingEntityList = feedEntity.feedHashTagMappings;
      const newHashTagList = patchFeedRequestDTO.hashTagList;
      const newHashTagIdList = [];
      // 요청온 hashtagList의 HashTagId를 받아옴. 만약 없다면 만들어서 받아옴.
      for (let i = 0; i < newHashTagList.length; i++) {
        const hashTagEntity = await this.hashTagRepository.findByName(
          newHashTagList.at(i),
        );

        if (hashTagEntity.length > 0) {
          // 있을경우
          newHashTagIdList.push(hashTagEntity.at(0).hashTagId);
        } else {
          // 없을경우
          const hashTagEntity: HashTags = new HashTags();
          hashTagEntity.hashTagName = newHashTagList.at(i);

          const returnValue = await this.hashTagRepository.saveHashTag(
            hashTagEntity,
          );
          newHashTagIdList.push(returnValue.hashTagId);
        }
      }
      if (originHashTagMappingEntityList.length != 0) {
        const originHashTagMappingIdList: number[] = [];

        // hashTagMappingEntityList를 정렬할 필요. (오름차순 정렬.)
        originHashTagMappingEntityList.sort(
          (
            firstHashTag: FeedHashTagMapping,
            secondHashTag: FeedHashTagMapping,
          ) => (firstHashTag.hashTagId > secondHashTag.hashTagId ? 1 : -1), // 1을 반환하면 secondHashTag가 더 높은 정렬 우선순위 가짐.
        );
        newHashTagIdList.sort();
        await this.hashTagPatch(
          originHashTagMappingEntityList,
          newHashTagIdList,
          patchFeedRequestDTO.feedId,
        );
      } else {
        //기존에 해시태그가 없는 게시물의 경우.
        for (let i = 0; i < newHashTagIdList.length; i++) {
          const feedHashTagMapping = new FeedHashTagMapping();
          feedHashTagMapping.feedId = patchFeedRequestDTO.feedId;
          feedHashTagMapping.hashTagId = newHashTagIdList.at(i);
          await this.hashTagFeedMappingRepository.save(feedHashTagMapping);
        }
      }
    } catch (err) {
      console.log(err);
      return errResponse(baseResponse.DB_ERROR);
    } finally {
      await queryRunner.release();
    }
    return sucResponse(baseResponse.SUCCESS);
  }
  async hashTagPatch(
    originHashTagMappingEntityList: FeedHashTagMapping[],
    newHashTagIdList: number[],
    feedId,
  ) {
    // 둘중 하나라도 빈배열이 생기면 끝.
    while (
      originHashTagMappingEntityList.length != 0 &&
      newHashTagIdList.length != 0
    ) {
      const originHashTag = originHashTagMappingEntityList.at(0);
      const newHashTag = newHashTagIdList.at(0);
      console.log('origin hashTag');
      console.log(originHashTag);
      console.log('new hashTag');
      console.log(newHashTag);
      let feedHashTagMapping: FeedHashTagMapping;
      if (originHashTag.hashTagId > newHashTag) {
        //newHashTag저장
        console.log('originHashTag.hashTagId > newHashTag');
        feedHashTagMapping = new FeedHashTagMapping();
        feedHashTagMapping.feedId = feedId;
        feedHashTagMapping.hashTagId = newHashTag;
        await this.hashTagFeedMappingRepository.save(feedHashTagMapping);
        newHashTagIdList.shift();
      } else if (originHashTag.hashTagId < newHashTag) {
        //origin이 삭제되어야함.
        console.log('originHashTag.hashTagId < newHashTag');
        await this.hashTagFeedMappingRepository.removeById(originHashTag);
        originHashTagMappingEntityList.shift();
      } else {
        originHashTagMappingEntityList.shift();
        newHashTagIdList.shift();
      }
    }
    console.log('while문 벗어남!!');
    console.log(originHashTagMappingEntityList);
    console.log(newHashTagIdList);
    if (
      originHashTagMappingEntityList.length == 0 &&
      newHashTagIdList.length != 0
    ) {
      console.log('here');
      for (let i = 0; i < newHashTagIdList.length; i++) {
        const feedHashTagMapping: FeedHashTagMapping = new FeedHashTagMapping();
        feedHashTagMapping.feedId = feedId;
        feedHashTagMapping.hashTagId = newHashTagIdList.at(i);
        this.hashTagFeedMappingRepository.save(feedHashTagMapping);
      }
    } else if (
      originHashTagMappingEntityList.length != 0 &&
      newHashTagIdList.length == 0
    ) {
      console.log('there');
      // originCategoryMappingEntityList를 다 삭제.
      const originHashTagMappingIdList: number[] = [];
      for (let i = 0; i < originHashTagMappingEntityList.length; i++) {
        originHashTagMappingIdList.push(
          originHashTagMappingEntityList.at(i).id,
        );
      }
      console.log('there2');
      console.log(originHashTagMappingIdList);
      this.hashTagFeedMappingRepository.delete(originHashTagMappingIdList);
    }
  }
  async RetrieveFeeds(
    profileId: number,
    pageNumber: number,
    categoryId: number,
    onlyFollowing: boolean,
  ): Promise<any> {
    // [REFACTORED]
    // return this.feeds;
    // const feedEntity = await this.feedRepsitory.retrieveFeeds(
    //   profileId,
    //   pageNumber,
    //   categoryId,
    // );
    // const feedIdList = [];
    //
    // console.log(feedEntity);
    // if (feedEntity.length == 0) {
    //   return errResponse(baseResponse.FEED_NOT_FOUND);
    // }
    // for (let i = 0; i < feedEntity.length; i++) {
    //   feedIdList.push(feedEntity[i].feedId);
    // }
    // const isLikeEntity = await this.likeRepository.isLike(
    //   feedIdList,
    //   profileId,
    // );
    // console.log(feedEntity);
    //
    // const foundDTO: retrieveFeedsReturnDto = new retrieveFeedsReturnDto(feedEntity, isLikeEntity);
    //
    // // console.log(util.inspect(foundDTO, {showHidden: false, depth: null}));
    // return foundDTO;
    // ---

    const rawFeedList = await this.feedRepsitory.retrieveOtherFeeds(
      profileId,
      pageNumber,
      categoryId,
      onlyFollowing,
    );
    // console.log(rawFeedList);

    // 원하는 정보들만 가공해서 보여주기
    const feedListDTO: retrieveFeedListDto = new retrieveFeedListDto(
      profileId,
      rawFeedList,
      onlyFollowing,
    );
    // console.log(feedListDTO);

    if (feedListDTO.feedArray.length <= 0) {
      return sucResponse(baseResponse.SUCCESS, []);
    } else {
      return sucResponse(baseResponse.SUCCESS, feedListDTO.feedArray);
    }
  }

  async RetreiveMyFeedByMonth(
    profileId: number,
    year: number,
    month: string,
    day: number,
    pageNumber: number,
  ) {
    let feedEntity: Feeds[];
    try {
      feedEntity = await this.feedRepsitory.retrieveMyFeedByMonth(
        profileId,
        year,
        month,
        day,
        pageNumber,
      );
    } catch (err) {
      return errResponse(baseResponse.DB_ERROR);
    }

    console.log(feedEntity);
    try {
      const foundDTO: RetreiveMyFeedByMonthReturnDTO =
        new RetreiveMyFeedByMonthReturnDTO(feedEntity);
      return sucResponse(baseResponse.SUCCESS, foundDTO);
    } catch (err) {
      return errResponse(baseResponse.SERVER_ERROR);
    }
  }

  async RetriveMyFeedInCalender(profileId, year, month) {
    try {
      const feedEntities: RetreiveMyFeedInCalendarReturnDTO[] =
        await this.feedRepsitory.RetriveMyFeedInCalender(
          profileId,
          year,
          month,
        );
      // RetriveMyFeedByMonth와는 다르게 GROUP BY 를 통해 일자별로 정리되어야하며 일자에 따라 ORDER BY 되어야한다.
      console.log('return object');
      console.log(feedEntities);
      // const foundDTOList:RetreiveMyFeedInCalendarReturnDTO[]=[];

      // for(let i =0; i<feedEntities.length; i++){

      //     console.log(feedEntities[i].feedId);
      //     console.log(feedEntities[i].day);
      //     console.log(feedEntities[i].feedImgUrl);
      //     foundDTOList.push(new RetreiveMyFeedInCalendarReturnDTO(feedEntities[0]));
      // }

      // console.log(foundDTOList);
      // const foundDTO:RetreiveMyFeedByMonthReturnDTO=new RetreiveMyFeedByMonthReturnDTO(feedEntity);
      // console.log(foundDTO);

      return sucResponse(baseResponse.SUCCESS, feedEntities);
    } catch (err) {
      return errResponse(baseResponse.DB_ERROR);
    }
  }

  // 게시글 신고하기
  async reportFeeds(reportFeedsDto: ReportFeedsDto) {
    try {
      const targetFeedId = reportFeedsDto.feedId;
      const reportCategoryId = reportFeedsDto.reportCategoryId;
      const reportContent = reportFeedsDto.content;

      if (reportContent) {
        // TODO: ReportContent에 report 저장
      }
      const reportResult = await this.feedRepsitory.reportFeeds(targetFeedId);

      console.log(reportResult);

      return sucResponse(baseResponse.SUCCESS);
    } catch (error) {
      return errResponse(baseResponse.DB_ERROR);
    }
  }

  async postFeed(
    postFeedRequestDTO: PostFeedRequestDTO,
    images: Array<Express.Multer.File>,
  ) {
    const newHashTagList: string[] = postFeedRequestDTO.hashTagList;
    const saveHashTagIdList = [];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const feedEntity = PostFeedRequestDTO.DTOtoEntity(postFeedRequestDTO);

      const savedFeedEntity = await this.feedRepsitory.save(feedEntity);

      console.log('자 여기서 시작');
      console.log(images);
      if (images) {
        // 사용자가 이미지를 전달한 경우
        console.log('들어와따!!!');
        for (let i = 0; i < images.length; i++) {
          const imageUploadResult = await this.AwsService.uploadFileToS3(
            'FeedBucket',
            images[i],
          );
          const imgDir = imageUploadResult.key;
          const feedImg = new FeedImgs();
          feedImg.feedId = savedFeedEntity.feedId;
          feedImg.feedImgUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${imgDir}`;
          await this.feedImgRepository.save(feedImg);
        }
      }

      for (let i = 0; i < newHashTagList.length; i++) {
        const hashTagEntity = await this.hashTagRepository.findByName(
          newHashTagList.at(i),
        );

        if (hashTagEntity.length > 0) {
          // 있을경우
          saveHashTagIdList.push(hashTagEntity.at(0).hashTagId);
        } else {
          // 없을경우
          const hashTagEntity: HashTags = new HashTags();
          hashTagEntity.hashTagName = newHashTagList.at(i);

          const returnValue = await this.hashTagRepository.saveHashTag(
            hashTagEntity,
          );
          saveHashTagIdList.push(returnValue.hashTagId);
        }
      }

      for (let i = 0; i < saveHashTagIdList.length; i++) {
        const feedHashTagMapping = new FeedHashTagMapping();
        feedHashTagMapping.feedId = savedFeedEntity.feedId;
        feedHashTagMapping.hashTagId = saveHashTagIdList.at(i);
        await this.hashTagFeedMappingRepository.save(feedHashTagMapping);
      }
    } catch (err) {
      console.log(err);
      return errResponse(baseResponse.DB_ERROR);
    } finally {
      await queryRunner.release();
    }

    return sucResponse(baseResponse.SUCCESS);
  }

  async deleteFeed(deleteFeedDTO: DeleteFeedDTO) {
    let feedEntity: Feeds;
    try {
      feedEntity = await this.feedRepsitory.findOne(deleteFeedDTO.feedId);
    } catch (err) {
      return errResponse(baseResponse.DB_ERROR);
    }

    if (!feedEntity) {
      return errResponse(baseResponse.FEED_NOT_FOUND);
    }
    const profileEntity: Profiles[] = await this.profileRepository.getOne(
      deleteFeedDTO.profileId,
    );
    if (profileEntity.length == 0) {
      return errResponse(baseResponse.PROFILE_NOT_EXIST);
    }

    if (feedEntity.profileId != deleteFeedDTO.profileId) {
      return errResponse(baseResponse.FEED_NO_AUTHENTICATION);
    }

    try {
      await this.feedRepsitory.deleteFeed(deleteFeedDTO.feedId);
    } catch (err) {
      return errResponse(baseResponse.DB_ERROR);
    }

    return sucResponse(baseResponse.SUCCESS);
  }

  async searchFeedsByHashtag(
    profileId: number,
    pageNumber: number,
    categoryId: number,
    onlyFollowing: boolean,
    hashtag: string,
  ): Promise<any> {
    // 1. 해시태그가 있는지 검색
    const hashTagEntity = await this.hashTagRepository.findByName(hashtag);
    // console.log(hashTagEntity);
    // 해시태그가 없는 경우 (검색 결과 없음)
    if (hashTagEntity.length <= 0) {
      return sucResponse(baseResponse.SUCCESS, []);
    }
    // 해시태그가 있는 경우
    const hashTagId = hashTagEntity[0].hashTagId;
    // 2. 해시태그 ID를 통해 게시글 검색
    const rawListForFeedId=await this.feedRepsitory.getFeedByhashTagId(profileId,pageNumber,categoryId,hashTagId,onlyFollowing);
    const feedIdList=new Array<number>();
    for(let i=0; i<rawListForFeedId.length; i++)
      feedIdList.push(rawListForFeedId.at(i).feedId);
    
  
    console.log(feedIdList);
      
    const rawFeedList = await this.feedRepsitory.retrieveOtherFeedsByHashtag(
      feedIdList,
      profileId,
      onlyFollowing
    );
    // for(let i=0; i<rawFeedList.length; i++){
    //   if(rawFeedList.at(i).feedId=60)
    //     console.log(rawFeedList.at(i).feedHashTagMappings)
    // }

    // 원하는 정보들만 가공해서 보여주기
    const feedListDTO: retrieveFeedListDto = new retrieveFeedListDto(
      profileId,
      rawFeedList,
      onlyFollowing,
    );
    // console.log(feedListDTO);

    if (feedListDTO.feedArray.length <= 0) {
      return sucResponse(baseResponse.SUCCESS, []);
    } else {
      return sucResponse(baseResponse.SUCCESS, feedListDTO.feedArray);
    }
  }
}
