import { ApiProperty } from '@nestjs/swagger';
import { create } from 'domain';
import { FeedImgs } from '../../common/entities/FeedImgs';
import { Feeds } from '../../common/entities/Feeds';
import { Likes } from '../../common/entities/Likes';

export class retrieveFeedListDto {
  @ApiProperty({ description: 'feedArray' })
  feedArray: Feed[] = [];

  constructor(rawFeedList: any[], onlyFollowing: any) {
    let cnt = 0;
    // 데이터 가공하기
    for (let i = 0; i < rawFeedList.length; i++) {
    
      // 탐색 게시글 목록
      if (onlyFollowing=="false" || onlyFollowing == false) {
        console.log("not only following");
        this.feedArray.push(new Feed(rawFeedList.at(i)));
      }
      // 팔로잉 게시글 목록
      else {
        console.log("only following");
        if (rawFeedList.at(i).followInfo != null) {
          this.feedArray.push(new Feed(rawFeedList.at(i)));
        }
      }
      cnt++;
    }
  }
}

export class Feed {
  @ApiProperty()
  private feedId: number;
  @ApiProperty()
  private personaId: number;
  @ApiProperty()
  private personaName: string;
  @ApiProperty({
    description: '게시글 주인의 프로필 id',
  })
  private profileId: number;
  @ApiProperty()
  private profileName: string;
  @ApiProperty()
  private profileImg: string;

  @ApiProperty()
  private createdAt: string; // 언제 생성된 게시글인지 확인해줘야한다.
  @ApiProperty()
  private feedContent: string;
  @ApiProperty({
    description:
      '피드 이미지의 경우 최대 5개까지 보내집니다. 이미지없이 단순 줄글인경우 빈 배열이 전송됩니다.',
  })
  private feedImgList: Array<string> = [];
  @ApiProperty({
    description:
      '현재 로그인한 profileId가 이 게시글을 좋아요 눌렀을 경우 true 좋아요를 누르지 않았을 경우 false가 전송됩니다.',
  })
  private isLike: boolean = false;
  @ApiProperty({
    description:
      '현재 로그인한 profileId가 이 프로필을 팔로우 했을 경우 true 팔로우 하지 않았을 경우 false가 전송됩니다.',
  })
  private isFollowing: boolean = false;

  @ApiProperty()
    private hashTagList:Array<String>=new Array();

  
  constructor(feedEntity: any) {
    this.feedId = feedEntity.feedId;
    this.personaId = feedEntity.profile.personaId;
    this.personaName = feedEntity.profile.profileName;
    this.profileId = feedEntity.profileId;
    this.profileImg = feedEntity.profile.profileImgUrl;
    this.profileName = feedEntity.profile.persona.personaName;
    this.feedContent = feedEntity.content;
    this.createdAt = this.transformFromDateToFormat(feedEntity.createdAt);
    for (let i = 0; i < feedEntity.feedImgs.length; i++) {
      this.feedImgList.push(feedEntity.feedImgs.at(i).feedImgUrl);
    }
    console.log(feedEntity.feedHashTagMappings.at(0));
    if (feedEntity.feedHashTagMappings) {
      for(let i=0; i<feedEntity.feedHashTagMappings.length;i++){
        this.hashTagList.push(feedEntity.feedHashTagMappings.at(i).hashTag.hashTagName);
      }  
    }
    // 좋아요 표시
    // this.isLike = isLike;
    if (feedEntity.likes.length > 0) {
      this.isLike = true;
    }
    // 팔로우 표시
    // this.isFollowing = isFollowing;
    if (feedEntity.followInfo != null) {
      this.isFollowing = true;
    }
  }

  transformFromDateToFormat(createdAt: Date) {
    const currentTime = new Date();
    const diffTime = currentTime.getTime() - createdAt.getTime();
    console.log(currentTime);
    console.log(
      currentTime.getFullYear() +
        '년 ' +
        (currentTime.getMonth() + 1) +
        '월 ' +
        currentTime.getDate() +
        '일 ' +
        currentTime.getHours() +
        ':' +
        currentTime.getMinutes() +
        ':' +
        currentTime.getSeconds(),
    );
    console.log(createdAt);
    console.log(
      createdAt.getFullYear() +
        '년 ' +
        (createdAt.getMonth() + 1) +
        '월 ' +
        createdAt.getDate() +
        '일 ' +
        createdAt.getHours() +
        ':' +
        createdAt.getMinutes() +
        ':' +
        createdAt.getSeconds(),
    );
    if (diffTime / (1000 * 60 * 60 * 24) >= 7) {
      const year = createdAt.getFullYear();
      const month = createdAt.getMonth() + 1;
      const day = createdAt.getDate();
      // console.log(year+"년 "+month+"월 "+day+"일")
      return year + '년 ' + month + '월 ' + day + '일';
    } else if (diffTime / (1000 * 60 * 60 * 24) > 1) {
      const currentDate = currentTime.getDate();
      const createdDate = currentTime.getDate();
      const beforeDay = currentDate - createdDate;
      return beforeDay + '일 전';
    } else if (diffTime / (1000 * 60 * 60) > 1) {
      const beforeHour = diffTime / (1000 * 60 * 60);
      // console.log(Math.floor(beforeHour)+"시간 전");
      return Math.round(beforeHour) + '시간 전';
    } else if (diffTime / (1000 * 60) > 1) {
      const beforeMinute = diffTime / (1000 * 60);
      // console.log(Math.floor(beforeMinute)+"분 전");
      return Math.floor(beforeMinute) + '분 전';
    } else {
      // console.log("방금");
      return '방금';
    }
  }
}
