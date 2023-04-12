import { Injectable } from '@nestjs/common';
import { ProfileBlock } from '../common/entities/ProfileBlock';
import baseResponse from '../common/utils/baseResponseStatus';
import { errResponse, sucResponse } from '../common/utils/response';
import { ProfilesRepository } from '../profiles/profiles.repository';
import { ProfileBlockRepository } from './profile-block.repository';
import { UsersRepository } from '../users/users.repository';
import { profile } from 'console';
import { BlcokedProfileDTO } from './dto/BlockedProfileDTO';

@Injectable()
export class ProfileBlockService {
    
    constructor(
        private usersRepository: UsersRepository,
        private profilesRepository: ProfilesRepository,
        private profileBlockRepository: ProfileBlockRepository,
    ) { };
    async getBlockedProfiles(profileId: number) {
        const blcokedProfileIdObjectList = await this.profileBlockRepository.getProfileList(profileId);
        console.log("뭐지?")
        const blockedProfileIdList = new Array();
        for (let i = 0; i < blcokedProfileIdObjectList.length; i++) blockedProfileIdList.push(blcokedProfileIdObjectList.at(i).blockedProfileId);
        console.log("여기서..?");
        const profileList = await this.profilesRepository.getBlockedProfiles(blockedProfileIdList);
        const blockedProfileList = new Array();

        for (let i = 0; i < profileList.length; i++) {
            const profile = profileList.at(i);
            console.log(profile);
            blockedProfileList.push(new BlcokedProfileDTO(profile["persona"].personaName, profile.profileName, profile.profileImgUrl));
        }

        console.log(profileList);
        return sucResponse(baseResponse.SUCCESS,blockedProfileList);
    }
    async blockProfile(loginedUserId:number,fromProfileId: number, toProfileId: number,type : String) {
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
            
            const userEntity = await this.usersRepository.getUserByProfileId(toProfileId);
            console.log(userEntity);
            let target = toProfileId
            let status;
            const profileList = await this.profilesRepository.getProfilesOfUser(userEntity.userId);
            console.log(profileList);
            for (let i = 0; i < profileList.length; i++) {
                if (profileList[i].profileId == target) status = "HOST";
                else status = "NORMAL";

                const profileBlock = new ProfileBlock(fromProfileId, profileList[i].profileId, status); 
                console.log(profileBlock);
                const isExist = await this.profileBlockRepository.isExist(profileBlock);
                let foundEntity;
                if (type == "BLOCK" && isExist.length == 0) {
                    console.log(profileBlock.toProfileId == target);
                    foundEntity = await this.profileBlockRepository.postBlock(profileBlock);
                    
                } else if (type == "UNBLOCK" && isExist.length != 0) {
                    await this.profileBlockRepository.deleteBlock(profileBlock);
                }
            }
            console.log(type);
            console.log(type=="BLOCK")
            return type=="BLOCK" ? sucResponse(baseResponse.BLCOK) : sucResponse(baseResponse.UN_BLCOK);

        } catch (err) {
            console.log(err);
            return errResponse(baseResponse.DB_ERROR);
        }
    }
}
