import { ApiProperty } from "@nestjs/swagger";
import { FeedImgs } from "../../common/entities/FeedImgs";
import { Feeds } from "../../common/entities/Feeds";
import { Likes } from "../../common/entities/Likes";

export class retrieveFeedsReturnDto {
    @ApiProperty({description:"feedArray"})
    feedArray: Feed[]=new Array();

	constructor(FeedEntityList: Feeds[],LikesEntityList: Likes[]) {
        let cnt=0;
        for(let i=0; i<FeedEntityList.length; i++){
            let tmp_feed;
            if(LikesEntityList.length>cnt && FeedEntityList.at(i).feedId==LikesEntityList[cnt].feedId){
                tmp_feed=new Feed(FeedEntityList.at(i),true);
                cnt++;
            }
            else
                tmp_feed=new Feed(FeedEntityList.at(i),false);
            console.log("생성 완료");
            // console.log(tmp_feed);
            this.feedArray.push(tmp_feed);
        }
	}
    
}

export class Feed{
    @ApiProperty()
    private feedId: number;
    @ApiProperty()
    private personaId: number;
    @ApiProperty()
    private personaName: String;
    @ApiProperty()
    private profileName: String;
    @ApiProperty({description:"게시글 생성일자는 String형태로 보내드리며 받으신 값을 정해진 위치에 그대로 삽입하시면 됩니다.\n\
                                아직 기획이 구체화 되지 않아 db에서 받은값을 그대로 보내드리고 있으며 어떻게 표시할지가 구체화 되면\n\
                                변경될 예정입니다."})
    private createdAt: String; // 언제 생성된 게시글인지 확인해줘야한다.
    @ApiProperty()
    private feedContent: String;
    @ApiProperty({description:"피드 이미지의 경우 최대 5개까지 보내집니다. 이미지없이 단순 줄글인경우 빈 배열이 전송됩니다."})
    private feedImgList: Array<String>=new Array();
    @ApiProperty({description:"현재 로그인한 profileId가 이 게시글을 좋아요 눌렀을 경우 true 좋아요를 누르지 않았을 경우 false가 전송됩니다."})
    private isLike : Boolean;



	constructor(feedEnitty: any,isLike: Boolean) {
        this.feedId=feedEnitty.feedId;
        this.personaId=feedEnitty.profile.personaId;
        this.personaName=feedEnitty.profile.profileName;
        this.profileName=feedEnitty.profile.persona.personaName;
        this.feedContent=feedEnitty.content;
        this.createdAt=feedEnitty.createdAt;
        for(let i =0; i<feedEnitty.feedImgs.length; i++){
            this.feedImgList.push(feedEnitty.feedImgs.at(i).feedImgUrl);
        }
        this.isLike=isLike;
	}

	
    
    
}
