import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FollowFromTo } from "../_entities/FollowFromTo";

@Injectable()
export class FollowingRepository{
    async deleteFollow(follow: FollowFromTo) {
        return await this.followingTable.delete({
            fromUserId: follow.fromUserId,
            toUserId:follow.toUserId
        });
    }
    constructor(
        @InjectRepository(FollowFromTo)
        private followingTable: Repository<FollowFromTo>
      ) {};

      
    async isExist(follow: FollowFromTo) {
        return await this.followingTable.find({where: { 
            fromUserId: follow.fromUserId,
            toUserId:follow.toUserId
        }})
    }

    async postFollow(followEntity: FollowFromTo) {
        let result=null;
        try{
            result=await this.followingTable.save(followEntity);
        }catch(err){
            console.log(err);
        }
        
        return result;
    }
    

}