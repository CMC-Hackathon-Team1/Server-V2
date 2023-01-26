import { Injectable } from '@nestjs/common';
import { Likes } from '../../common/entities/Likes';
import baseResponse from '../../common/utils/baseResponseStatus';
import { sucResponse } from '../../common/utils/response';
import { PostLikeRequestDTO } from '../dto/post-like.dto';
import { LikesRepository } from '../likes.repository';

@Injectable()
export class LikesService {
    constructor(
        private likeRepository:LikesRepository,
    ){};

    async postLikes(feedId: number,profileId:number): Promise<any> {//고쳐야함.

        //팔로윙이 안되어있는 상태라면 팔로우 팔로우된 상태라면 언팔로우
        const likesEntity=new Likes(profileId,feedId);
        console.log(likesEntity);
        const isExist=await this.likeRepository.isExist(likesEntity);

        let likeOrHate;
        let foundEntity;

        if(isExist.length==0){
            console.log("like");
            likeOrHate="like";
            foundEntity=await this.likeRepository.postLike(likesEntity);
            return sucResponse(baseResponse.POST_LIKE);
        }else{
            console.log("didn't like");
            likeOrHate="didn't like";

            await this.likeRepository.deleteLike(likesEntity);
            return sucResponse(baseResponse.DELETE_LIKE);
        }
    } 
}
