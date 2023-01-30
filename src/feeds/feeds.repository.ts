import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { profile } from "console";
import { Repository } from "typeorm";
import { FeedImgs } from "../common/entities/FeedImgs";
import { Feeds } from "../common/entities/Feeds";
import { Likes } from "../common/entities/Likes";

@Injectable()
export class FeedRepository{
    
    constructor(
        @InjectRepository(Feeds)
        private feedTable: Repository<Feeds>
      ) {};

    async retrieveFeeds(profileId : number,pageNumber: number,categoryId : number):Promise<Feeds[]> {

        console.log(profileId,categoryId);

        const foundQuery=this.feedTable
            .createQueryBuilder('Feeds')
            .leftJoinAndSelect('Feeds.profile','profiles')
            .leftJoinAndSelect('profiles.persona','persona')
            .leftJoinAndSelect('Feeds.feedImgs','feedImg')
            .leftJoin('Feeds.feedCategoryMappings','categorymap')
            .leftJoinAndSelect('categorymap.category','category')
            
        
        if(categoryId!=0){ //0이 아닐때는 categoryId를 통한 필터링
            foundQuery.where('category.categoryId=:category',{category:categoryId})
                      .skip(10*(pageNumber-1))
                      .take(10)
        }else{//0일때는 categoryId를 통한 필터링 적용 x
            foundQuery.skip(10*(pageNumber-1))
                      .take(10)
        }
            
        return foundQuery.getMany();
    }

    retrieveMyFeedByMonth(profileId: number, year: number, month: number,day:number,pageNumber:number) {
        
        

        const query=this.feedTable
            .createQueryBuilder('Feeds')
            .leftJoinAndSelect('Feeds.feedImgs','feedImg')
            .where("Feeds.profileId=:profileId",{profileId:profileId})
            .skip(10*(pageNumber-1))
            .take(10)
            
            console.log(day)
            if(day==null){
                console.log("day is null");
                const target_date=year+"-"+month;
                query.andWhere('DATE_FORMAT(`Feeds`.`createdAt`, "%Y-%m")=:target',{target:target_date});
            }else{
                console.log("day is not null");
                const target_date=year+"-"+month+"-"+day;
                query.andWhere('DATE_FORMAT(`Feeds`.`createdAt`, "%Y-%m-%d")=:target',{target:target_date});
            }

        return query.getMany();
    }

    RetriveMyFeedInCalender(profileId: number, year: number, month: number) {
        
        const this_month=year+"-"+month;
        console.log(this_month);

        const found=this.feedTable
            .createQueryBuilder('Feeds')
            .leftJoin('Feeds.feedImgs','feedImg')
            .select([
                'Feeds.feedId as feedId' ,
                `DATE_FORMAT(Feeds.createdAt,'%d') as day`,
                `feedImg.feedImgUrl as feedImgUrl`,
            ])
            .where("Feeds.profileId=:profileId",{profileId:profileId})
            .andWhere('DATE_FORMAT(`Feeds`.`createdAt`, "%Y-%m")=:target',{target:this_month})
            .groupBy('day')
            .orderBy('day')
            .getRawMany();
        return found;
    }
}