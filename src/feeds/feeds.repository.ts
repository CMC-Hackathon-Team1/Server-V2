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

        const found=this.feedTable
            .createQueryBuilder('Feeds')
            .leftJoinAndSelect('Feeds.profile','profiles')
            .leftJoinAndSelect('profiles.persona','persona')
            .leftJoinAndSelect('Feeds.feedImgs','feedImg')
            .leftJoin('Feeds.feedCategoryMappings','categorymap')
            .leftJoinAndSelect('categorymap.category','category')
            .where('category.categoryId=:category',{category:categoryId})
            .skip(10*(pageNumber-1))
            .take(10)
            .getMany();
            
        return found;
    }

    retrieveMyFeedByMonth(profileId: number, year: number, month: number,pageNumber:number) {
        
        const this_month=year+"-"+month;
        console.log(this_month);

        const found=this.feedTable
            .createQueryBuilder('Feeds')
            .leftJoinAndSelect('Feeds.feedImgs','feedImg')
            .where("Feeds.profileId=:profileId",{profileId:profileId})
            .andWhere('DATE_FORMAT(`Feeds`.`createdAt`, "%Y-%m")=:target',{target:this_month})
            .skip(10*(pageNumber-1))
            .take(10)
            .getMany();
        return found;
    }
}