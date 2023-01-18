import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { profile } from "console";
import { Repository } from "typeorm";
import { FeedImgs } from "../_entities/FeedImgs";
import { Feeds } from "../_entities/Feeds";
import { Likes } from "../_entities/Likes";

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
}