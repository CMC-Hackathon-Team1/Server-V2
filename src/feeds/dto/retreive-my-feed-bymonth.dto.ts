import { ApiProperty } from "@nestjs/swagger";
import { FeedImgs } from "../../common/entities/FeedImgs";
import { Feeds } from "../../common/entities/Feeds";
import { Likes } from "../../common/entities/Likes";

export class RetreiveMyFeedByMonthReturnDTO {
    @ApiProperty({description:"feedArray"})
    feedArray: MyFeed[]=new Array();

	constructor(FeedEntityList: Feeds[]) {
        for(let i=0; i<FeedEntityList.length; i++){
            this.feedArray.push(new MyFeed(FeedEntityList.at(i)));
        }
	}
    
}

export class MyFeed{
    @ApiProperty()
    private feedId: number;
    @ApiProperty()
    private feedContent: String;
    @ApiProperty({description:"게시글 생성일자는 String형태로 보내드리며 받으신 값을 정해진 위치에 그대로 삽입하시면 됩니다.\n\
                                아직 기획이 구체화 되지 않아 db에서 받은값을 그대로 보내드리고 있으며 어떻게 표시할지가 구체화 되면\n\
                                변경될 예정입니다."})
    private createdAt: String; // 언제 생성된 게시글인지 확인해줘야한다.
    @ApiProperty({description:"피드 이미지의 경우 최대 5개까지 보내집니다. 이미지없이 단순 줄글인경우 빈 배열이 전송됩니다."})
    private feedImgList: Array<String>=new Array();
    private isLike: boolean=false;
    private likeNum: number;
    
	constructor(feedEnitty: any) {
        this.feedId=feedEnitty.feedId;
        this.feedContent=feedEnitty.content;
        this.createdAt=feedEnitty.createdAt;
        for(let i =0; i<feedEnitty.feedImgs.length; i++){
            this.feedImgList.push(feedEnitty.feedImgs.at(i).feedImgUrl);
        }
        if (feedEnitty.isLike)
            this.isLike = true;
        this.likeNum=feedEnitty.likeNum;
	}   
}
