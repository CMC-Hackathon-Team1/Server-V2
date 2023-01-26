import { Injectable } from '@nestjs/common';
import { FollowFromTo } from '../common/entities/FollowFromTo';
import baseResponse from '../common/utils/baseResponseStatus';
import { sucResponse } from '../common/utils/response';
import { FollowingRepository } from './following.repository';

@Injectable()
export class FollowingService {
    constructor(
        private followingRepository:FollowingRepository,
    ){};

    async postFollow(fromProfileId: number,toProfileId: number): Promise<any> {//고쳐야함.

        //팔로윙이 안되어있는 상태라면 팔로우 팔로우된 상태라면 언팔로우
        const follow=new FollowFromTo(fromProfileId,toProfileId);
        const isExist=await this.followingRepository.isExist(follow);
        let foundEntity;
        if(isExist.length==0){
            foundEntity=await this.followingRepository.postFollow(follow);
            return sucResponse(baseResponse.POST_FOLLOW);
        }else{
            await this.followingRepository.deleteFollow(follow);
            return sucResponse(baseResponse.DELETE_FOLLOW);
        }
    } 
}
