import { ApiProperty } from "@nestjs/swagger";
import { TokenFileWebIdentityCredentials } from "aws-sdk";
import { Feeds } from "../../common/entities/Feeds";
import { ExploreOptions } from "../enum/expore-options-enum";

export class PostFeedRequestDTO{
    @ApiProperty()
    private profileId:number;

    @ApiProperty()
    private categoryId:number;
    
    @ApiProperty()
    private hashTagList:String[];
    
    @ApiProperty()
    private content:string;
    
    @ApiProperty()
    private isSecret:ExploreOptions;

    toEntity():Feeds{
        let feedEntity:Feeds=new Feeds();
        feedEntity.profileId=this.profileId;
        feedEntity.content=this.content;
        feedEntity.isSecret=this.isSecret;
        feedEntity.categoryId=this.categoryId;
        
        return feedEntity;
    }
}