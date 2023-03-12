import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Likes } from "../common/entities/Likes";

@Injectable()
export class LikesRepository{
    async getLikeList(feedId: number) {
        return await this.likeTable.createQueryBuilder()
                    .andWhere("feedId =:feedId",{feedId:feedId})
                    .getMany()
    }
    async isLike(feedIdList: number[],profileId: number) {
        return await this.likeTable.createQueryBuilder()
                    .where("profileId=:profileId",{profileId:profileId})
                    .andWhere("feedId IN (:feedIdList)",{feedIdList:feedIdList})
                    .getMany()
    }
    constructor(
        @InjectRepository(Likes)
        private likeTable: Repository<Likes>
      ) {};

    async deleteLike(likesEntity: Likes) {
        return await this.likeTable.delete({
            profileId: likesEntity.profileId,
            feedId:likesEntity.feedId
        });
    }
      
    async isExist(likesEntity: Likes) {
        return await this.likeTable.find({where: { 
            profileId: likesEntity.profileId,
            feedId:likesEntity.feedId
        }})
    }

    async postLike(likesEntity: Likes) {
        let result=null;
        try{
            result=await this.likeTable.save(likesEntity);
        }catch(err){
            console.log(err);
        }
        
        return result;
    }
    
    async findProfileIdByFeedId(feedId: number) {
        return await this.likeTable
            .createQueryBuilder('Likes')
            .leftJoinAndSelect('Likes.feed', 'Feeds')
            .select(['Feeds.profileId AS profileId'])
            .where('Likes.feedId=:feedId', { feedId: feedId })
            .getRawOne();
    }
}