import { ApiProperty } from "@nestjs/swagger";
import { FeedImgs } from "../../common/entities/FeedImgs";
import { Feeds } from "../../common/entities/Feeds";
import { Likes } from "../../common/entities/Likes";

export class RetreiveMyFeedInCalendarReturnDTO {
    private feedId:number;
    private imgUrl:String;
    private day:number;

    constructor(feedEntity: any){
        this.feedId =feedEntity.feedId;
        this.imgUrl=feedEntity.feedImgUrl;
        this.day=feedEntity.day;
    }
}
