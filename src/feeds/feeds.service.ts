import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikesRepository } from '../likes/likes.repository';
import { Feeds } from '../common/entities/Feeds';
import { Feed, retrieveFeedsReturnDto } from './dto/retreive-feeds-return.dto';
import { RetreiveMyFeedByMonthReturnDTO } from './dto/retreive-my-feed-bymonth.dto';
import { FeedRepository } from './feeds.repository';
import { RetreiveMyFeedInCalendarReturnDTO } from './dto/retrive-my-feed-in-calendar.dto';
import { ProfilesRepository } from '../profiles/profiles.repository';
import { Profiles } from '../common/entities/Profiles';
const util = require('util');

@Injectable()
export class FeedsService {
    constructor(
        private feedRepsitory:FeedRepository,
        private likeRepository:LikesRepository,
        private profileRepository:ProfilesRepository
    ){};

    async RetreiveFeeds(profileId : number,pageNumber: number,categoryId : number): Promise<retrieveFeedsReturnDto> {
        // return this.feeds;

        /*
            feedId : number; feedEntity
            personaId: number; feedEntity
            PersonaName: String; feedEntity
            profileName: String; feedEntiity

            createdAt: String; // feedEntity 언제 생성된 게시글인지 확인해줘야한다. o 수정들어가야함.

            feedContent: String; // feedEntity
            feedImgList: Array<FeedImgs>; // x
            isLike : Boolean; //x likeNum만 나옴.
        */

        //isLike field가 Feeds entity에 없어 우선 raw한 object로 받아온다. 이부분을 refactoring하고싶다.
        const feedEntity=await this.feedRepsitory.retrieveFeeds(profileId,pageNumber,categoryId);
        const feedIdList=[];

        for(let i=0; i<feedEntity.length; i++){
            feedIdList.push(feedEntity[i].feedId);
        }
        const isLikeEntity=await this.likeRepository.isLike(feedIdList,profileId);
        console.log(isLikeEntity);

        console.log(feedEntity);
        

        const foundDTO: retrieveFeedsReturnDto=new retrieveFeedsReturnDto(feedEntity,isLikeEntity);
        
        // console.log(util.inspect(foundDTO, {showHidden: false, depth: null}));
        return foundDTO;
    }

    async RetreiveMyFeedByMonth(profileId: number, year: number, month: number,day:number,pageNumber:number) :Promise<RetreiveMyFeedByMonthReturnDTO>{
        const feedEntity:Feeds[]=await this.feedRepsitory.retrieveMyFeedByMonth(profileId,year,month,day,pageNumber);

        console.log(feedEntity);
        const foundDTO:RetreiveMyFeedByMonthReturnDTO=new RetreiveMyFeedByMonthReturnDTO(feedEntity);
        console.log(foundDTO);

        return foundDTO;
    }

    async RetriveMyFeedInCalender(profileId,year,month) :Promise<RetreiveMyFeedInCalendarReturnDTO[]>{
        const feedEntities:any=await this.feedRepsitory.RetriveMyFeedInCalender(profileId,year,month);
        // RetriveMyFeedByMonth와는 다르게 GROUP BY 를 통해 일자별로 정리되어야하며 일자에 따라 ORDER BY 되어야한다.

        
        const foundDTOList:RetreiveMyFeedInCalendarReturnDTO[]=[];

        for(let i =0; i<feedEntities.length; i++){
            
            console.log(feedEntities[i].feedId);
            console.log(feedEntities[i].day);
            console.log(feedEntities[i].feedImgUrl);
            foundDTOList.push(new RetreiveMyFeedInCalendarReturnDTO(feedEntities[0]));
        }

        console.log(foundDTOList);
        // const foundDTO:RetreiveMyFeedByMonthReturnDTO=new RetreiveMyFeedByMonthReturnDTO(feedEntity);
        // console.log(foundDTO);

        return foundDTOList;
    }


    async postFeed(postFeedRequestDTO){//반환형 써야지 ㅎㅎ
        // DTO -> FeedEntity;
        /*
            feedId: number;                                 AUTO_INCREMENT로 진행
            profileId: number;                              O
            content: string;                                O
            likeNum: number;                                0(숫자)DEFAULT
            createdAt: Date;                                DEFAULT
            updatedAt: Date;                                DEFAULT
            status: string;                                 'PUBLIC_ACTIVE'
            feedCategoryMappings: FeedCategoryMapping[];    CategoryIdList
            feedHashTagMappings: FeedHashTagMapping[];      HashTagNameList
            feedImgs: FeedImgs[];                           나중에
            profile: Profiles;                              profileId로 받아온 DTO확인.
            likes: Likes[];                                 null
        */

        const feedEntity:Feeds=postFeedRequestDTO.toEntity();

        const profileEntity=await this.profileRepository.findProfileByProfileId(postFeedRequestDTO.profileId);
        // 해시 태그 부터
        /*
            for(postFeedRequestDTO.feedHashTagMappings.length){
                if(isExist){

                }else{

                }
            }
            
        
        */

        console.log(profileEntity);
        // console.log(feedEntity);
    };
}
