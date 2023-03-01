import { Injectable } from '@nestjs/common';
import { getDataSourceName, InjectRepository } from '@nestjs/typeorm';
import { profile } from 'console';
import { Repository } from 'typeorm';
import { FeedHashTagMapping } from '../common/entities/FeedHashTagMapping';
import { FeedImgs } from '../common/entities/FeedImgs';
import { Feeds } from '../common/entities/Feeds';
import { Likes } from '../common/entities/Likes';
import { PatchFeedRequestDTO } from './dto/patch-feed-request.dto';
import { FollowFromTo } from '../common/entities/FollowFromTo';

@Injectable()
export class FeedRepository {
  
  constructor(
    @InjectRepository(Feeds)
    private feedTable: Repository<Feeds>, // @InjectRepository(FollowFromTo) // private followTable: Repository<FollowFromTo>,
  ) {}

  async findFeedById(feedId: number,profileId): Promise<Feeds> {
    const foundQuery = this.feedTable
      .createQueryBuilder('Feeds')
      .leftJoinAndSelect('Feeds.profile', 'profiles')
      .leftJoinAndSelect('profiles.persona', 'persona')
      .leftJoinAndSelect('Feeds.feedImgs', 'feedImg')
      .leftJoinAndSelect('Feeds.categories', 'category')
      .leftJoinAndSelect('Feeds.feedHashTagMappings', 'feedHashTagMappings')
      .leftJoinAndSelect('feedHashTagMappings.hashTag', 'hashTags')
      .leftJoinAndMapOne(
        'Feeds.followInfo',
        FollowFromTo,
        'followFromTo',
        'followFromTo.fromUserId = :profileId and followFromTo.toUserId = profiles.profileId',
        { profileId: profileId },
      )
      .where('Feeds.feedId=:feedId', { feedId: feedId })
      .andWhere('Feeds.status=:status', { status: 'ACTIVE' })
      .andWhere('Feeds.isSecret=:isSecret', { isSecret: "PUBLIC" });
    return foundQuery.getOne();
  }
  async save(feedEntity: Feeds) {
    return this.feedTable.save(feedEntity);
  }
  async deleteFeed(feedId: number) {
    this.feedTable.update({ feedId: feedId }, { status: 'INACTIVE' });
  }
  async update(patchFeedRequestDTO: PatchFeedRequestDTO) {
    const result = this.feedTable.update(
      { feedId: patchFeedRequestDTO.feedId },
      {
        categoryId: patchFeedRequestDTO.categoryId,
        content: patchFeedRequestDTO.content,
        isSecret: patchFeedRequestDTO.isSecret,
      },
    );
    return result;
  }
  async findOne(id: number) {
    const feedEntity = this.feedTable.findOne({
      where: { feedId: id },
      relations: ['feedHashTagMappings'],
    });

    return feedEntity;
  }

  async findByFeedId(id: number) {
    const feedEntity = this.feedTable.findOne({
      where: { feedId: id },
    });
    return feedEntity;
  }
  // updateFeed(patchFeedRequestDTO: PatchFeedRequestDTO) {
  //   this.feedTable.update(patchFeedRequestDTO.feedId, entity); //두번째 인자로 entity가 들어가야함.
  // }
  async retrieveFeeds(
    profileId: number,
    pageNumber: number,
    categoryId: number,
  ): Promise<Feeds[]> {
    console.log(profileId, categoryId);

    const foundQuery = this.feedTable
      .createQueryBuilder('Feeds')
      .leftJoinAndSelect('Feeds.profile', 'profiles')
      .leftJoinAndSelect('profiles.persona', 'persona')
      .leftJoinAndSelect('Feeds.feedImgs', 'feedImg')
      .leftJoinAndSelect('Feeds.categories', 'category')
      .leftJoinAndSelect('Feeds.feedHashTagMappings', 'feedHashTagMappings')
      .leftJoinAndSelect('feedHashTagMappings.hashTag', 'hashTags')
      .where('Feeds.isSecret=:isSecret', { isSecret: 'PUBLIC' });

    if (categoryId != 0) {
      //0이 아닐때는 categoryId를 통한 필터링
      foundQuery
        .andWhere('Feeds.categoryId=:category', { category: categoryId })
        .skip(10 * (pageNumber - 1))
        .take(10);
    } else {
      //0일때는 categoryId를 통한 필터링 적용 x
      foundQuery.skip(10 * (pageNumber - 1)).take(10);
    }

    return foundQuery.getMany();
  }

  // 둘러보기 - 타유저 게시글 가져오기
  async retrieveOtherFeeds(
    profileId: number,
    pageNumber: number,
    categoryId: number,
    onlyFollowing: any,
  ): Promise<Feeds[]> {
    // console.log(profileId, categoryId);

    const foundQuery = this.feedTable
      .createQueryBuilder('Feeds')
      .where('Feeds.isSecret=:isSecret', { isSecret: 'PUBLIC' })
      .andWhere('Feeds.status=:status', { status: 'ACTIVE' })
      .andWhere('Feeds.profileId!=:ownProfileId', { ownProfileId: profileId }) // 본인 게시글 제외
      .leftJoinAndSelect('Feeds.profile', 'profiles')
      .leftJoinAndSelect('profiles.persona', 'persona')
      .leftJoinAndSelect('Feeds.feedImgs', 'feedImg')
      .leftJoinAndSelect('Feeds.categories', 'category')
      // .leftJoinAndSelect('Feeds.likes', 'likes')
      .leftJoinAndSelect('Feeds.feedHashTagMappings', 'feedHashTagMapping')
      .leftJoinAndSelect('feedHashTagMapping.hashTag', 'hashTag')
      .orderBy({ 'Feeds.createdAt': 'DESC', 'Feeds.feedId': 'DESC' })
    // .andWhere('likes.profileId=:ownProfileId', { ownProfileId: profileId })   // 본인이 좋아요 누른 게시글만
    ;

    // 좋아요 여부
    foundQuery.leftJoinAndMapOne(
      'Feeds.likeInfo',
      Likes,
      'likes',
      'likes.profileId = :profileId and Feeds.feedId = likes.feedId',
      { profileId: profileId },
    );

    // 팔로우 여부
    if (onlyFollowing == 'false' || onlyFollowing == false) {
      foundQuery.leftJoinAndMapOne(
        'Feeds.followInfo',
        FollowFromTo,
        'followFromTo',
        'followFromTo.fromUserId = :profileId and followFromTo.toUserId = profiles.profileId',
        { profileId: profileId },
      );
    } else {
      foundQuery.innerJoinAndMapOne(
        'Feeds.followInfo',
        FollowFromTo,
        'followFromTo',
        'followFromTo.fromUserId = :profileId and followFromTo.toUserId = profiles.profileId',
        { profileId: profileId },
      );
    }

    if (categoryId != 0) {
      //0이 아닐때는 categoryId를 통한 필터링
      foundQuery
        .andWhere('Feeds.categoryId=:category', { category: categoryId })
        .skip(10 * (pageNumber - 1))
        .take(10);
    } else {
      //0일때는 categoryId를 통한 필터링 적용 x
      foundQuery.skip(10 * (pageNumber - 1)).take(10);
    }

    return foundQuery.getMany();
  }

  retrieveMyFeedByMonth(
    profileId: number,
    year: number,
    month: string,
    day: number,
    pageNumber: number,
  ) {
    const query = this.feedTable
      .createQueryBuilder('Feeds')
      .leftJoinAndSelect('Feeds.feedImgs', 'feedImg')
      .where('Feeds.profileId=:profileId', { profileId: profileId })
      .andWhere('Feeds.status=:status', { status: 'ACTIVE' })
      .skip(10 * (pageNumber - 1))
      .take(10);

    console.log(day);
    if (day == null) {
      console.log('day is null');
      const target_date = year + '-' + month;
      query.andWhere('DATE_FORMAT(`Feeds`.`createdAt`, "%Y-%m")=:target', {
        target: target_date,
      });
    } else {
      console.log('day is not null');
      const target_date = year + '-' + month + '-' + day;
      query.andWhere('DATE_FORMAT(`Feeds`.`createdAt`, "%Y-%m-%d")=:target', {
        target: target_date,
      });
    }

    return query.getMany();
  }

  async RetriveMyFeedInCalender(
    profileId: number,
    year: number,
    month: number,
  ) {
    const this_month = year + '-' + month;
    console.log(this_month);

    const found = await this.feedTable.query(
      `select sub.feedId,
      imgSub.feedImgUrl,
      date_format(sub.originCreatedAt, "%d") as day
       from (select feedId,
                    profileId,
                    content,
                    likeNum,
                    createdAt                                  as originCreatedAt,
                    ROW_NUMBER() OVER (PARTITION BY createdAt) as ranking,
                    status
             from Feeds
             where (createdAt) IN (
                   select max(createdAt)
                   from Feeds
                   where DATE_FORMAT(createdAt, "%Y-%m") = ?#이부분 parameter처리.
                     and profileId = ?                      #이부분도 parameter처리
                   group by DATE_FORMAT(createdAt, "%Y-%m-%d")
                   ) AND status='ACTIVE'
             ) as sub
        LEFT JOIN (select feedId, max(feedImgUrl) as feedImgUrl from FeedImgs group by feedId) as imgSub
                  on sub.feedId = imgSub.feedId
        where ranking = 1
        order by day asc;`,
      [this_month, profileId],
    );
    return found;
  }

  async reportFeeds(feedId: number) {
    return await this.feedTable.update(feedId, { status: 'REPORTED' });
  }

  async getFeedByhashTagId(profileId: number, pageNumber: number, categoryId: number, hashTagId: number,onlyFollowing: any,) {
    const foundQuery = this.feedTable
      .createQueryBuilder()
      .leftJoin('Feeds.profile', 'profiles')
      .leftJoin('Feeds.feedHashTagMappings', 'feedHashTagMapping')
      .leftJoin('feedHashTagMapping.hashTag', 'hashTag')
      .select(['Feeds.feedId', 'Feeds.createdAt'])
      .where('Feeds.isSecret=:isSecret', { isSecret: 'PUBLIC' })
      .andWhere('Feeds.status=:status', { status: 'ACTIVE' })
      .andWhere('Feeds.profileId!=:ownProfileId', { ownProfileId: profileId })  // 본인 게시글 제외
      .andWhere('feedHashTagMapping.hashTagId=:hashTagId', { hashTagId: hashTagId })
      .orderBy({ 'Feeds.createdAt': 'DESC', 'Feeds.feedId': 'DESC' })
    ;
    
    // 팔로우 여부
    if (onlyFollowing == 'false' || onlyFollowing == false) {
      foundQuery.leftJoinAndMapOne(
        'Feeds.followInfo',
        FollowFromTo,
        'followFromTo',
        'followFromTo.fromUserId = :profileId and followFromTo.toUserId = profiles.profileId',
        { profileId: profileId },
      );
    } else {
      foundQuery.innerJoinAndMapOne(
        'Feeds.followInfo',
        FollowFromTo,
        'followFromTo',
        'followFromTo.fromUserId = :profileId and followFromTo.toUserId = profiles.profileId',
        { profileId: profileId },
      );
    }

    if (categoryId != 0) {
      //0이 아닐때는 categoryId를 통한 필터링
      foundQuery
        .andWhere('Feeds.categoryId=:category', { category: categoryId })
        .skip(10 * (pageNumber - 1))
        .take(10);
    } else {
      //0일때는 categoryId를 통한 필터링 적용 x
      foundQuery.skip(10 * (pageNumber - 1)).take(10);
    }

    return foundQuery.getMany();
  }
  async retrieveOtherFeedsByHashtag(
    feedIdList: Array<number>,
    profileId:number,
    onlyFollowing: any
  ) {
    const foundQuery = this.feedTable
      .createQueryBuilder('Feeds')
      .leftJoinAndSelect('Feeds.profile', 'profiles')
      .leftJoinAndSelect('profiles.persona', 'persona')
      .leftJoinAndSelect('Feeds.feedImgs', 'feedImg')
      .leftJoinAndSelect('Feeds.categories', 'category')
      .leftJoinAndSelect('Feeds.feedHashTagMappings', 'feedHashTagMapping')
      .leftJoinAndSelect('feedHashTagMapping.hashTag', 'hashTag')
      .whereInIds(feedIdList)
      .orderBy({ 'Feeds.createdAt': 'DESC', 'Feeds.feedId': 'DESC' })
    ;
    // 좋아요 여부
    foundQuery.leftJoinAndMapOne(
      'Feeds.likeInfo',
      Likes,
      'likes',
      'likes.profileId = :profileId and Feeds.feedId = likes.feedId',
      { profileId: profileId },
    );
    // 팔로우 여부
    if (onlyFollowing == 'false' || onlyFollowing == false) {
      foundQuery.leftJoinAndMapOne(
        'Feeds.followInfo',
        FollowFromTo,
        'followFromTo',
        'followFromTo.fromUserId = :profileId and followFromTo.toUserId = profiles.profileId',
        { profileId: profileId },
      );
    } else {
      foundQuery.innerJoinAndMapOne(
        'Feeds.followInfo',
        FollowFromTo,
        'followFromTo',
        'followFromTo.fromUserId = :profileId and followFromTo.toUserId = profiles.profileId',
        { profileId: profileId },
      );
    }

    return foundQuery.getMany();
  }
}
