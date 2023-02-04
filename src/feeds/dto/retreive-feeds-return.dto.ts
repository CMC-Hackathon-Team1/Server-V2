import { ApiProperty } from "@nestjs/swagger";
import { create } from "domain";
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
        this.createdAt=this.transformFromDateToFormat(feedEnitty.createdAt);
        for(let i =0; i<feedEnitty.feedImgs.length; i++){
            this.feedImgList.push(feedEnitty.feedImgs.at(i).feedImgUrl);
        }
        this.isLike=isLike;
	}

    transformFromDateToFormat(createdAt:Date){
        const currentTime = new Date();
        const diffTime=currentTime.getTime()-createdAt.getTime()
        console.log(currentTime);
        console.log(currentTime.getFullYear()+"년 "+(currentTime.getMonth()+1)+"월 "+currentTime.getDate()+"일 "+currentTime.getHours()+":"+currentTime.getMinutes()+":"+currentTime.getSeconds());
        console.log(createdAt);
        console.log(createdAt.getFullYear()+"년 "+(createdAt.getMonth()+1)+"월 "+createdAt.getDate()+"일 "+createdAt.getHours()+":"+createdAt.getMinutes()+":"+createdAt.getSeconds());
        if(diffTime/(1000*60*60*24)>=7){
            const year=createdAt.getFullYear();
            const month=createdAt.getMonth()+1;
            const day=createdAt.getDate();
            // console.log(year+"년 "+month+"월 "+day+"일")
            return year+"년 "+month+"월 "+day+"일";
        }else if(diffTime/(1000*60*60*24)>1){
            const currentDate=currentTime.getDate();
            const createdDate=currentTime.getDate();
            const beforeDay=currentDate-createdDate;
            return beforeDay+"일 전";
        }else if(diffTime/(1000*60*60)>1){
            const beforeHour=diffTime/(1000*60*60);
            // console.log(Math.floor(beforeHour)+"시간 전");
            return Math.round(beforeHour)+"시간 전";
        }else if(diffTime/(1000*60)>1){
            const beforeMinute=diffTime/(1000*60);
            // console.log(Math.floor(beforeMinute)+"분 전");
            return Math.floor(beforeMinute)+"분 전";
        }else{
            // console.log("방금");
            return "방금";
        }
    }
}
