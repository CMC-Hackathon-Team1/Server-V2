import { ApiProperty } from "@nestjs/swagger";

export class GetFeedByIdResDTO{
    @ApiProperty()
    private feedId: number;
    
    @ApiProperty()
    private personaName: String;
    @ApiProperty()
    private profileName: String;
    @ApiProperty()
    private profileImg:String;
    @ApiProperty()
    private createdAt: String; // 언제 생성된 게시글인지 확인해줘야한다.
    @ApiProperty()
    private feedContent: String;
    @ApiProperty({description:"피드 이미지의 경우 최대 5개까지 보내집니다. 이미지없이 단순 줄글인경우 빈 배열이 전송됩니다."})
    private feedImgList: Array<String>=new Array();
    @ApiProperty({description:"현재 로그인한 profileId가 이 게시글을 좋아요 눌렀을 경우 true 좋아요를 누르지 않았을 경우 false가 전송됩니다."})
    private isLike : Boolean;
    @ApiProperty()
    private isFollowing: Boolean;
    @ApiProperty()
    private hashTagList:Array<String>=new Array();
    @ApiProperty()
    private categoryId:number;
    @ApiProperty()
    private likeNum:number;
    @ApiProperty()
    private isSecret:String;

	constructor(feedEntity: any,isLike: Boolean,likeNum:number) {
        this.feedId=feedEntity.feedId;
        this.personaName=feedEntity.profile.persona.personaName;
        this.profileName=feedEntity.profile.profileName;
        this.feedContent=feedEntity.content;
        this.profileImg=feedEntity.profile.profileImgUrl;
        this.createdAt=this.transformFromDateToFormat(feedEntity.createdAt);
        for(let i =0; i<feedEntity.feedImgs.length; i++){
            this.feedImgList.push(feedEntity.feedImgs.at(i).feedImgUrl);
        }
        if (feedEntity.feedHashTagMappings) {
            for(let i=0; i<feedEntity.feedHashTagMappings.length;i++){
              this.hashTagList.push(feedEntity.feedHashTagMappings.at(i).hashTag.hashTagName);
            }  
          }
        this.isLike = isLike;
        this.likeNum=likeNum;
        if (feedEntity['followInfo']) {
            this.isFollowing = true;
        } else {
            this.isFollowing = false;
        }
        this.categoryId=feedEntity.categories.categoryId;
        this.isSecret=feedEntity.isSecret;
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
