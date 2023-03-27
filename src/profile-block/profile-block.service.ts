import { Injectable } from '@nestjs/common';
import { ProfileBlock } from '../common/entities/ProfileBlock';
import baseResponse from '../common/utils/baseResponseStatus';
import { errResponse, sucResponse } from '../common/utils/response';
import { ProfilesRepository } from '../profiles/profiles.repository';
import { ProfileBlockRepository } from './profile-block.repository';

@Injectable()
export class ProfileBlockService {
    constructor(
        private profilesRepository: ProfilesRepository,
        private profileBlockRepository: ProfileBlockRepository,
    ){};
    async blockProfile(loginedUserId:number,fromProfileId: number, toProfileId: number) {
        try {
            // check loginedUserId => fromProfileId 같은 유저 맞는지?
            const isExistFromProfile=await this.profilesRepository.getProfileByProfileId(fromProfileId);
            if(!isExistFromProfile){
                console.log(isExistFromProfile);
                return errResponse(baseResponse.FROM_USER_ID_NOT_FOUND);
            }
            console.log("toUserId= " + toProfileId);
            const isExistToProfile=await this.profilesRepository.getProfileByProfileId(toProfileId);
            if(!isExistToProfile){
                console.log(isExistToProfile);
                return errResponse(baseResponse.TO_USER_ID_NOT_FOUND);
            }

            const profileBlock = new ProfileBlock(fromProfileId, toProfileId);
            console.log("여기서?");
            const isExist = await this.profileBlockRepository.isExist(profileBlock);
            console.log("여기서?");
            let foundEntity;
            if(isExist.length==0){
                foundEntity=await this.profileBlockRepository.postBlock(profileBlock);
                return sucResponse(baseResponse.BLCOK);
            }else{
                await this.profileBlockRepository.deleteBlock(profileBlock);
                return sucResponse(baseResponse.UN_BLCOK);
            }
        } catch (err) {
            console.log(err);
            return errResponse(baseResponse.DB_ERROR);
        }
    }
}
