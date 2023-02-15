import { Injectable } from '@nestjs/common';
import { Likes } from '../../common/entities/Likes';
import baseResponse from '../../common/utils/baseResponseStatus';
import { errResponse, sucResponse } from '../../common/utils/response';
import { FeedRepository } from '../../feeds/feeds.repository';
import { ProfilesRepository } from '../../profiles/profiles.repository';
import { PostLikeRequestDTO } from '../dto/post-like.dto';
import { LikesRepository } from '../likes.repository';

@Injectable()
export class LikesService {
    constructor(
        private likeRepository:LikesRepository,
        private profilesRepository:ProfilesRepository,
        private feedRepository:FeedRepository
    ){};

    async postLikes(feedId: number,profileId:number): Promise<any> {//고쳐야함.
        //유효한 profile인지 CHECK해야함.
        //유효한 Feed인지 check해야함.
        const likesEntity=new Likes(profileId,feedId);
        console.log(likesEntity);
        try{
            const isExistProfile=await this.profilesRepository.getProfileByProfileId(profileId);
            if(!isExistProfile){
                console.log(isExistProfile);
                return errResponse(baseResponse.PROFILE_ID_NOT_FOUND);
            }
            const isExistFeed=await this.feedRepository.findByFeedId(feedId);
            if(!isExistFeed){
                console.log(isExistFeed);
                return errResponse(baseResponse.FEED_NOT_FOUND);
            }
            
            const isExist=await this.likeRepository.isExist(likesEntity);
            if(isExist.length==0){
                console.log("like");
                await this.likeRepository.postLike(likesEntity);
                return sucResponse(baseResponse.POST_LIKE);
            }else{
                console.log("didn't like");
    
                await this.likeRepository.deleteLike(likesEntity);
                return sucResponse(baseResponse.DELETE_LIKE);
            }
        }catch(err){
            console.log(err);
            return errResponse(baseResponse.DB_ERROR);
        }
        
    } 
}
