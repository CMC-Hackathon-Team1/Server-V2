import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileBlock } from '../common/entities/ProfileBlock';

@Injectable()
export class ProfileBlockRepository {
    
    constructor(
        @InjectRepository(ProfileBlock)
        private profileBlockTable: Repository<ProfileBlock>,
    ) { }

    async deleteBlock(profileBlock: ProfileBlock) {
        return await this.profileBlockTable.delete({
            fromProfileId: profileBlock.fromProfileId,
            toProfileId:profileBlock.toProfileId
        });
    }
    async postBlock(profileBlock: ProfileBlock){
        let result=null;
        try{
            result=await this.profileBlockTable.save(profileBlock);
        }catch(err){
            console.log(err);
        }
        
        return result;
    }
    async isExist(profileBlock: ProfileBlock) {
        return await this.profileBlockTable.find({where: { 
            fromProfileId: profileBlock.fromProfileId,
            toProfileId:profileBlock.toProfileId
        }})
    }
}
