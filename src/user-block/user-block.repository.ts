import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBlock } from '../common/entities/UserBlock';

@Injectable()
export class UserBlockRepository {
    
    constructor(
        @InjectRepository(UserBlock)
        private userBlockTable: Repository<UserBlock>,
    ) { }

    async deleteBlock(userBlock: UserBlock) {
        return await this.userBlockTable.delete({
            fromUserId: userBlock.fromUserId,
            toUserId:userBlock.toUserId
        });
    }
    async postBlock(userBlock: UserBlock){
        let result=null;
        try{
            result=await this.userBlockTable.save(userBlock);
        }catch(err){
            console.log(err);
        }
        
        return result;
    }
    async isExist(userBlock: UserBlock) {
        return await this.userBlockTable.find({where: { 
            fromUserId: userBlock.fromUserId,
            toUserId:userBlock.toUserId
        }})
    }
}
