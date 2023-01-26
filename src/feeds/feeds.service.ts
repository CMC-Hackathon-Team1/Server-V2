import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikesRepository } from '../likes/likes.repository';
import { Feeds } from '../common/entities/Feeds';
import { Feed, retrieveFeedsReturnDto } from './dto/retreive-feeds-return.dto';
import { RetreiveMyFeedByMonthReturnDTO } from './dto/retreive-my-feed-bymonth.dto';
import { FeedRepository } from './feeds.repository';
const util = require('util');

@Injectable()
export class FeedsService {
    constructor(
        private feedRepsitory:FeedRepository,
        private likeRepository:LikesRepository
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

    async RetreiveMyFeedByMonth(profileId: number, year: number, month: number,pageNumber:number) :Promise<RetreiveMyFeedByMonthReturnDTO>{
        const feedEntity:Feeds[]=await this.feedRepsitory.retrieveMyFeedByMonth(profileId,year,month,pageNumber);

        console.log(feedEntity);
        const foundDTO:RetreiveMyFeedByMonthReturnDTO=new RetreiveMyFeedByMonthReturnDTO(feedEntity);
        console.log(foundDTO);

        return foundDTO;
    }
}
