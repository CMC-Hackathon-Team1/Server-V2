import { ApiProperty } from '@nestjs/swagger';
import DateFormatter from '../../common/utils/dateFormatter';

export class retrieveFeedListDto {
  @ApiProperty({ description: 'feedArray' })
  feedArray: Feed[] = [];

  constructor(profileId: number, rawFeedList: any[], onlyFollowing: any) {
    // let cnt = 0;
    // 데이터 가공하기
    for (let i = 0; i < rawFeedList.length; i++) {
      // 탐색 게시글 목록
      if (onlyFollowing == 'false' || onlyFollowing == false) {
        // console.log('not only following');
        this.feedArray.push(new Feed(profileId, rawFeedList.at(i)));
      }
      // 팔로잉 게시글 목록
      else {
        // console.log('only following');
        if (rawFeedList.at(i).followInfo != null) {
          this.feedArray.push(new Feed(profileId, rawFeedList.at(i)));
        }
      }
      // cnt++;
    }
  }
}

export class Feed {
  @ApiProperty({
    description: '게시글 id',
  })
  private feedId: number;
  @ApiProperty({
    description: '게시글 주인의 프로필 id',
  })
  private profileId: number;
  @ApiProperty({
    description: '게시글 주인의 프로필 이름',
  })
  private profileName: string;
  @ApiProperty({
    description: '게시글 주인의 프로필 사진',
  })
  private profileImg: string;
  // @ApiProperty()
  // private personaId: number;
  @ApiProperty({
    description: '게시글 주인의 페르소나 이름',
  })
  private personaName: string;
  @ApiProperty({
    description: '게시글이 생성된 시간',
  })
  private createdAt: string; // 언제 생성된 게시글인지 확인해줘야한다.
  @ApiProperty({
    description: '게시글 내용',
  })
  private feedContent: string;
  @ApiProperty({
    description:
      '피드 이미지의 경우 최대 5개까지 보내집니다. 이미지 없이 단순 줄글인 경우 빈 배열이 전송됩니다.',
  })
  private feedImgList: Array<string> = [];
  @ApiProperty({
    description:
      '현재 로그인한 profileId가 이 게시글을 좋아요 눌렀을 경우 true, 좋아요를 누르지 않았을 경우 false가 전송됩니다.',
  })
  private isLike: boolean = false;
  @ApiProperty({
    description:
      '현재 로그인한 profileId가 이 프로필을 팔로우 했을 경우 true, 팔로우 하지 않았을 경우 false가 전송됩니다.',
  })
  private isFollowing: boolean = false;

  @ApiProperty({
    description: '게시글에 추가된 해시태그 목록',
  })
  private hashTagList: Array<string> = [];

  constructor(profileId: number, feedEntity: any) {
    let feedContentHashTag='';
    this.feedId = feedEntity.feedId;
    this.profileId = feedEntity.profileId;
    this.profileName = feedEntity.profile.profileName;
    this.profileImg = feedEntity.profile.profileImgUrl;
    // this.personaId = feedEntity.profile.personaId;
    this.personaName = feedEntity.profile.persona.personaName;
    this.createdAt = this.transformFromDateToFormat(feedEntity.createdAt);
    // 게시글 사진 목록
    for (let i = 0; i < feedEntity.feedImgs.length; i++) {
      this.feedImgList.push(feedEntity.feedImgs.at(i).feedImgUrl);
    }
    // 게시글 해시태그 목록
    // console.log(feedEntity.feedHashTagMappings.at(0));
    if (feedEntity.feedHashTagMappings) {
      for (let i = 0; i < feedEntity.feedHashTagMappings.length; i++) {
        this.hashTagList.push(
          feedEntity.feedHashTagMappings.at(i).hashTag.hashTagName,
        );
        feedContentHashTag+='#'+feedEntity.feedHashTagMappings.at(i).hashTag.hashTagName+' ';
      }
    }
    console.log(feedEntity.content);
    this.feedContent = feedContentHashTag+'\n'+feedEntity.content;
    // 좋아요 표시
    // this.isLike = isLike;
    if (feedEntity.likeInfo != null) {
      this.isLike = true;
    }
    // 팔로우 표시
    // this.isFollowing = isFollowing;
    if (feedEntity.followInfo != null) {
      this.isFollowing = true;
    }
  }

  transformFromDateToFormat(createdAt: Date) {
    return DateFormatter(createdAt);

    // const currentTime = new Date();
    // const diffTime = currentTime.getTime() - createdAt.getTime();
    // // console.log(currentTime);
    // // console.log(
    // //   currentTime.getFullYear() +
    // //     '년 ' +
    // //     (currentTime.getMonth() + 1) +
    // //     '월 ' +
    // //     currentTime.getDate() +
    // //     '일 ' +
    // //     currentTime.getHours() +
    // //     ':' +
    // //     currentTime.getMinutes() +
    // //     ':' +
    // //     currentTime.getSeconds(),
    // // );
    // // console.log(createdAt);
    // // console.log(
    // //   createdAt.getFullYear() +
    // //     '년 ' +
    // //     (createdAt.getMonth() + 1) +
    // //     '월 ' +
    // //     createdAt.getDate() +
    // //     '일 ' +
    // //     createdAt.getHours() +
    // //     ':' +
    // //     createdAt.getMinutes() +
    // //     ':' +
    // //     createdAt.getSeconds(),
    // // );
  }
}
