import { Injectable } from '@nestjs/common';
import { AlarmsService } from '../../alarms/service/alarms.service';
import { FollowFromTo } from '../../common/entities/FollowFromTo';
import baseResponse from '../../common/utils/baseResponseStatus';
import { errResponse, sucResponse } from '../../common/utils/response';
import { ProfilesRepository } from '../../profiles/profiles.repository';
import { FollowingRepository } from '../following.repository';

@Injectable()
export class FollowingService {
    constructor(
        private followingRepository:FollowingRepository,
        private profilesRepository:ProfilesRepository,
        private alarmsService: AlarmsService
    ){};

    async postFollow(fromProfileId: number,toProfileId: number): Promise<any> {//고쳐야함.
        try{
            const isExistFromProfile=await this.profilesRepository.findProfileByProfileId(fromProfileId);
            if(!isExistFromProfile){
                console.log(isExistFromProfile);
                return errResponse(baseResponse.FROM_PROFILE_ID_NOT_FOUND);
            }
            const isExistToProfile=await this.profilesRepository.findProfileByProfileId(toProfileId);
            if(!isExistToProfile){
                console.log(isExistToProfile);
                return errResponse(baseResponse.TO_PROFILE_ID_NOT_FOUND);
            }
            //팔로윙이 안되어있는 상태라면 팔로우 팔로우된 상태라면 언팔로우
            const follow=new FollowFromTo(fromProfileId,toProfileId);
            const isExist=await this.followingRepository.isExist(follow);
            let foundEntity;
            if(isExist.length==0){
                foundEntity=await this.followingRepository.postFollow(follow);

                // 푸시 알림용
                this.alarmsService.followingAlarm(fromProfileId, toProfileId);

                return sucResponse(baseResponse.POST_FOLLOW);
            }else{
                await this.followingRepository.deleteFollow(follow);
                return sucResponse(baseResponse.DELETE_FOLLOW);
            }
        }catch(err){
            return errResponse(baseResponse.DB_ERROR);
        }
    } 
}
