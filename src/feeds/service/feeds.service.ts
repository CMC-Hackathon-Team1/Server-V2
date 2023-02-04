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
import {DataSource} from 'typeorm'
import { DeleteFeedDTO } from '../dto/delete-feed-request.dto';
import { PostFeedRequestDTO } from '../dto/post-feed-request.dto';
const util = require('util');

@Injectable()
export class FeedsService {
  
  constructor(
    private feedRepsitory: FeedRepository,
    private likeRepository: LikesRepository,
    private profileRepository: ProfilesRepository,
    private hashTagRepository: HashTagRepository,
    private hashTagFeedMappingRepository:hashTagFeedMappingRepository,
    private dataSource:DataSource
  ) {}

  async patchFeed(patchFeedRequestDTO: PatchFeedRequestDTO) {
    // feedId를 통해 feedEntity가져옴. + save로 수정함.
    console.log("findOne");
    const feedEntity:Feeds=await this.feedRepsitory.findOne(patchFeedRequestDTO.feedId);
    if(!feedEntity){
      console.log(feedEntity);
      return errResponse(baseResponse.FEED_NOT_FOUND)
    }
    if(feedEntity.profileId!=patchFeedRequestDTO.profileId){
      console.log(feedEntity.profileId);
      return errResponse(baseResponse.FEED_NO_AUTHENTICATION)
    }
    //TODO 로그인된 userId가 profileId와 일치하는가.
    const queryRunner =this.dataSource.createQueryRunner();
    await queryRunner.connect()
    try{
        const result=await this.feedRepsitory.update(patchFeedRequestDTO)
        
        const originHashTagMappingEntityList=feedEntity.feedHashTagMappings;
        const newHashTagList=patchFeedRequestDTO.hashTagList;
        const newHashTagIdList=Array();
        // 요청온 hashtagList의 HashTagId를 받아옴. 만약 없다면 만들어서 받아옴.
        for(let i=0; i<newHashTagList.length;i++){
            const hashTagEntity=await this.hashTagRepository.findByName(newHashTagList.at(i));
            
            if(hashTagEntity.length>0){// 있을경우
                newHashTagIdList.push(hashTagEntity.at(0).hashTagId)
            }else{// 없을경우
                const hashTagEntity:HashTags=new HashTags();
                hashTagEntity.hashTagName=newHashTagList.at(i);
              
                const returnValue=await this.hashTagRepository.saveHashTag(hashTagEntity);
                newHashTagIdList.push(returnValue.hashTagId);
            }
        }
        if(originHashTagMappingEntityList.length!=0){
            const originHashTagMappingIdList:number[]=new Array();
            
            // hashTagMappingEntityList를 정렬할 필요. (오름차순 정렬.)
            originHashTagMappingEntityList.sort(
                (firstHashTag:FeedHashTagMapping, secondHashTag:FeedHashTagMapping)=>
                    (firstHashTag.hashTagId>secondHashTag.hashTagId)? 1:-1  // 1을 반환하면 secondHashTag가 더 높은 정렬 우선순위 가짐.
            )
            newHashTagIdList.sort();
            await this.hashTagPatch(originHashTagMappingEntityList,newHashTagIdList,patchFeedRequestDTO.feedId);
        }else{
          //기존에 해시태그가 없는 게시물의 경우.
          for(let i=0; i<newHashTagIdList.length; i++){
            const feedHashTagMapping=new FeedHashTagMapping();
            feedHashTagMapping.feedId=patchFeedRequestDTO.feedId;
            feedHashTagMapping.hashTagId=newHashTagIdList.at(i);
            await this.hashTagFeedMappingRepository.save(feedHashTagMapping);
          }
        }
    }catch(err){
        console.log(err);
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        await queryRunner.release();
    }
    return sucResponse(baseResponse.SUCCESS);
  }
  async hashTagPatch(originHashTagMappingEntityList:FeedHashTagMapping[],newHashTagIdList:number[],feedId){
        // 둘중 하나라도 빈배열이 생기면 끝.
    while(originHashTagMappingEntityList.length!=0 && newHashTagIdList.length!=0) {
        const originHashTag=originHashTagMappingEntityList.at(0);
        const newHashTag=newHashTagIdList.at(0);
        console.log("origin hashTag");
        console.log(originHashTag);
        console.log("new hashTag");
        console.log(newHashTag);
        let feedHashTagMapping:FeedHashTagMapping;
        if(originHashTag.hashTagId>newHashTag){ //newHashTag저장  
          console.log("originHashTag.hashTagId > newHashTag"); 
            feedHashTagMapping=new FeedHashTagMapping();
            feedHashTagMapping.feedId=feedId;
            feedHashTagMapping.hashTagId=newHashTag;
            await this.hashTagFeedMappingRepository.save(feedHashTagMapping);
            newHashTagIdList.shift();
        }else if(originHashTag.hashTagId<newHashTag){  //origin이 삭제되어야함.
          console.log("originHashTag.hashTagId < newHashTag");
          await this.hashTagFeedMappingRepository.removeById(originHashTag);
          originHashTagMappingEntityList.shift();
        }else{
          originHashTagMappingEntityList.shift();
          newHashTagIdList.shift();
        }
    }
    console.log("while문 벗어남!!");
    console.log(originHashTagMappingEntityList);
    console.log(newHashTagIdList);  
    if(originHashTagMappingEntityList.length==0 && newHashTagIdList.length!=0){    
      console.log("here");
        for(let i=0; i<newHashTagIdList.length; i++){
            const feedHashTagMapping:FeedHashTagMapping=new FeedHashTagMapping();
            feedHashTagMapping.feedId=feedId;
            feedHashTagMapping.hashTagId=newHashTagIdList.at(i);
            this.hashTagFeedMappingRepository.save(feedHashTagMapping);
        }
    }else if(originHashTagMappingEntityList.length!=0 && newHashTagIdList.length==0){
      console.log("there");
        // originCategoryMappingEntityList를 다 삭제.
        const originHashTagMappingIdList:number[]=new Array();
        for(let i =0; i<originHashTagMappingEntityList.length; i++){
            originHashTagMappingIdList.push(originHashTagMappingEntityList.at(i).id);
        }
        console.log("there2");
        console.log(originHashTagMappingIdList);
        this.hashTagFeedMappingRepository.delete(originHashTagMappingIdList);
    }

  }
  async RetreiveFeeds(
    profileId: number,
    pageNumber: number,
    categoryId: number,
  ): Promise<any> {
    // return this.feeds;
    let foundDTO: retrieveFeedsReturnDto;
    const feedEntity = await this.feedRepsitory.retrieveFeeds(
      profileId,
      pageNumber,
      categoryId,
    );
    const feedIdList = [];

    console.log(feedEntity);
    if(feedEntity.length==0){
      return errResponse(baseResponse.FEED_NOT_FOUND);
    }
    for (let i = 0; i < feedEntity.length; i++) {
      feedIdList.push(feedEntity[i].feedId);
    }
    const isLikeEntity = await this.likeRepository.isLike(
      feedIdList,
      profileId,
    );
    console.log(feedEntity);

    foundDTO = new retrieveFeedsReturnDto(
      feedEntity,
      isLikeEntity,
    );

    // console.log(util.inspect(foundDTO, {showHidden: false, depth: null}));
    return foundDTO;
  }

  
  async RetreiveMyFeedByMonth(
    profileId: number,
    year: number,
    month: number,
    day: number,
    pageNumber: number,
  ): Promise<RetreiveMyFeedByMonthReturnDTO> {
    const feedEntity: Feeds[] = await this.feedRepsitory.retrieveMyFeedByMonth(
      profileId,
      year,
      month,
      day,
      pageNumber,
    );

    console.log(feedEntity);
    const foundDTO: RetreiveMyFeedByMonthReturnDTO =
      new RetreiveMyFeedByMonthReturnDTO(feedEntity);
    console.log(foundDTO);

    return foundDTO;
  }

  async RetriveMyFeedInCalender(
    profileId,
    year,
    month,
  ): Promise<RetreiveMyFeedInCalendarReturnDTO[]> {
    const feedEntities: RetreiveMyFeedInCalendarReturnDTO[] =
      await this.feedRepsitory.RetriveMyFeedInCalender(profileId, year, month);
    // RetriveMyFeedByMonth와는 다르게 GROUP BY 를 통해 일자별로 정리되어야하며 일자에 따라 ORDER BY 되어야한다.
    console.log('return object');
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

    return feedEntities;
  }

  async reportFeeds(feedId: number) {
    try {
      const reportResult = await this.feedRepsitory.reportFeeds(feedId);

      console.log(reportResult);

      return sucResponse(baseResponse.SUCCESS);
    } catch (error) {
      return errResponse(baseResponse.DB_ERROR);
    }
  }

  async postFeed(postFeedRequestDTO:PostFeedRequestDTO) {
    //반환형 써야지 ㅎㅎ
    // DTO -> FeedEntity;
    /*
            feedId: number;                                 AUTO_INCREMENT로 진행
            profileId: number;                              O
            content: string;                                O
            likeNum: number;                                0(숫자)DEFAULT
            createdAt: Date;                                DEFAULT
            updatedAt: Date;                                DEFAULT
            status: string;                                 'ACTIVE'
            categoryId: number;                             O
            feedHashTagMappings: FeedHashTagMapping[];      HashTagNameList
            feedImgs: FeedImgs[];                           나중에
            profile: Profiles;                              profileId로 받아온 DTO확인.
            likes: Likes[];                                 null
        */
    const queryRunner =this.dataSource.createQueryRunner();
    await queryRunner.connect()
    const feedEntity: Feeds = postFeedRequestDTO.toEntity();
    try{
      await this.feedRepsitory.save(feedEntity);
    }catch(err){
      console.log(err);
      return errResponse(baseResponse.DB_ERROR);
    }finally{
      await queryRunner.release();
    }
    
    return sucResponse(baseResponse.SUCCESS,feedEntity);
  }

  async deleteFeed(deleteFeedDTO: DeleteFeedDTO) {
    let feedEntity:Feeds;
    let profileEntity:Profiles[];
    try{
      feedEntity=await this.feedRepsitory.findOne(deleteFeedDTO.feedId);

    }catch(err){
      return errResponse(baseResponse.DB_ERROR);
    }

    if(!feedEntity){
      return errResponse(baseResponse.FEED_NOT_FOUND);
    }
    profileEntity=await this.profileRepository.getOne(deleteFeedDTO.profileId);
    if(profileEntity.length==0){
      return errResponse(baseResponse.PROFILE_NOT_EXIST);
    }

    if(feedEntity.profileId!=deleteFeedDTO.profileId){
      return errResponse(baseResponse.FEED_NO_AUTHENTICATION);
    }

    try{
       await this.feedRepsitory.deleteFeed(deleteFeedDTO.feedId);
    }catch(err){
      return errResponse(baseResponse.DB_ERROR);
    }
    
    return sucResponse(baseResponse.SUCCESS);
  }
}
