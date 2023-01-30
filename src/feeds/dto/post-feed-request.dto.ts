import { ApiProperty } from "@nestjs/swagger";
import { TokenFileWebIdentityCredentials } from "aws-sdk";
import { Feeds } from "../../common/entities/Feeds";
import { ExploreOptions } from "../enum/expore-options-enum";

export class PostFeedRequestDTO{
    @ApiProperty()
    private _profileId:number;

    @ApiProperty()
    private categoryIdList:number[];
    
    @ApiProperty()
    private hashTagList:String[];
    
    @ApiProperty()
    private _content:string;
    
    @ApiProperty()
    private _isSecret:ExploreOptions;

    get content(){
        return this._content;
    }

    get profileId(){
        return this._profileId;
    }

    get isSecret(){
        return this._isSecret;
    }


    toEntity():Feeds{
        let feedEntity:Feeds=new Feeds();
        feedEntity.profileId=this._profileId;
        feedEntity.content=this._content;
        feedEntity.status=this._isSecret;
        
        return feedEntity;
    }
}