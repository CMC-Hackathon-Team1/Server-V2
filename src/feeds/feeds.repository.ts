import { Injectable } from '@nestjs/common';
import { getDataSourceName, InjectRepository } from '@nestjs/typeorm';
import { profile } from 'console';
import { Brackets, Repository } from 'typeorm';
import { FeedHashTagMapping } from '../common/entities/FeedHashTagMapping';
import { FeedImgs } from '../common/entities/FeedImgs';
import { Feeds } from '../common/entities/Feeds';
import { Likes } from '../common/entities/Likes';
import { PatchFeedRequestDTO } from './dto/patch-feed-request.dto';
import { FollowFromTo } from '../common/entities/FollowFromTo';
const moment = require('moment-timezone');


@Injectable()
export class FeedRepository {
  
  
  constructor(
    @InjectRepository(Feeds)
    private feedTable: Repository<Feeds>, // @InjectRepository(FollowFromTo) // private followTable: Repository<FollowFromTo>,
  ) {}
  async isExistToday(profileId: any) {
    const getCurrentTime = () => {
      var m = moment().tz("Asia/Seoul"); 
      return m.format("YYYY-MM-DD");
      };
  
    const today = getCurrentTime();
    console.log(today);
    const query = this.feedTable
      .createQueryBuilder('Feeds')
      .where('Feeds.profileId=:profileId', { profileId: profileId })
      .andWhere('Feeds.status=:status', { status: "ACTIVE" })
      .andWhere('DATE_FORMAT(Feeds.createdAt,"%Y-%m-%d")=:today', { today: today });
    
    return query.getOne();
  }
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
      .andWhere(new Brackets(qb => {
        qb.where('Feeds.isSecret=:isSecret1', { isSecret1: "PUBLIC" })
          .orWhere(new Brackets(qb => {
            qb.where('Feeds.isSecret=:isSecret2', { isSecret2: "PRIAVATE" })
              .andWhere('Feeds.profileId=:profileId', { profileId:profileId })}))
    }))

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
  //   this.feedTable.update(patchFeedRequestDTO.feedId, entity); //????????? ????????? entity??? ???????????????.
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
      //0??? ???????????? categoryId??? ?????? ?????????
      foundQuery
        .andWhere('Feeds.categoryId=:category', { category: categoryId })
        .skip(10 * (pageNumber - 1))
        .take(10);
    } else {
      //0????????? categoryId??? ?????? ????????? ?????? x
      foundQuery.skip(10 * (pageNumber - 1)).take(10);
    }

    return foundQuery.getMany();
  }

  // ???????????? - ????????? ????????? ????????????
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
      .andWhere('Feeds.profileId!=:ownProfileId', { ownProfileId: profileId }) // ?????? ????????? ??????
      .leftJoinAndSelect('Feeds.profile', 'profiles')
      .leftJoinAndSelect('profiles.persona', 'persona')
      .leftJoinAndSelect('Feeds.feedImgs', 'feedImg')
      .leftJoinAndSelect('Feeds.categories', 'category')
      // .leftJoinAndSelect('Feeds.likes', 'likes')
      .leftJoinAndSelect('Feeds.feedHashTagMappings', 'feedHashTagMapping')
      .leftJoinAndSelect('feedHashTagMapping.hashTag', 'hashTag')
      .orderBy({ 'Feeds.createdAt': 'DESC', 'Feeds.feedId': 'DESC' })
    // .andWhere('likes.profileId=:ownProfileId', { ownProfileId: profileId })   // ????????? ????????? ?????? ????????????
    ;

    // ????????? ??????
    foundQuery.leftJoinAndMapOne(
      'Feeds.likeInfo',
      Likes,
      'likes',
      'likes.profileId = :profileId and Feeds.feedId = likes.feedId',
      { profileId: profileId },
    );

    // ????????? ??????
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
      //0??? ???????????? categoryId??? ?????? ?????????
      foundQuery
        .andWhere('Feeds.categoryId=:category', { category: categoryId })
        .skip(10 * (pageNumber - 1))
        .take(10);
    } else {
      //0????????? categoryId??? ?????? ????????? ?????? x
      foundQuery.skip(10 * (pageNumber - 1)).take(10);
    }

    return foundQuery.getMany();
  }

  retrieveMyFeedByMonth(
    baseProfileId: number,
    targetProfileId: number,
    year: number,
    month: string,
    day: number,
    pageNumber: number,
  ) {
    
    const query = this.feedTable
      .createQueryBuilder('Feeds')
      .leftJoinAndSelect('Feeds.feedImgs', 'feedImg')
      .leftJoinAndSelect('Feeds.feedHashTagMappings', 'feedHashTagMapping')
      .leftJoinAndSelect('feedHashTagMapping.hashTag', 'hashTag')
      .where('Feeds.profileId=:targetProfileId', { targetProfileId: targetProfileId })
      .andWhere('Feeds.status=:status', { status: 'ACTIVE' })
      
      

    console.log(day);
    if (day != null) {
      console.log('day is not null');
      const target_date = year + '-' + month + '-' + day;
      query.andWhere('DATE_FORMAT(`Feeds`.`createdAt`, "%Y-%m-%d")=:target', {
        target: target_date,
      }).orderBy({'Feeds.createdAt':'ASC'});
    } else {
      let target_date = year + '-' + month;
      query.andWhere('DATE_FORMAT(`Feeds`.`createdAt`, "%Y-%m")=:target', {
        target: target_date,
      })
      .orderBy({'Feeds.createdAt':'ASC'})
    }
    query.skip(10 * (pageNumber - 1))
         .take(10);
    query.leftJoinAndMapOne(
      'Feeds.isLike',
      Likes,
      'isLike',
      'isLike.profileId = :baseProfileId and Feeds.feedId = isLike.feedId',
      { baseProfileId: baseProfileId },
    );
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
                   where DATE_FORMAT(createdAt, "%Y-%m") = ?#????????? parameter??????.
                     and profileId = ?                      #???????????? parameter??????
                   group by DATE_FORMAT(createdAt, "%Y-%m-%d")
                   ) AND status='ACTIVE' AND profileId= ?
             ) as sub
        LEFT JOIN (select feedId, max(feedImgUrl) as feedImgUrl from FeedImgs group by feedId) as imgSub
                  on sub.feedId = imgSub.feedId
        where ranking = 1
        order by day asc;`,
      [this_month, profileId,profileId],
    );
    return found;
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
      .andWhere('Feeds.profileId!=:ownProfileId', { ownProfileId: profileId })  // ?????? ????????? ??????
      .andWhere('feedHashTagMapping.hashTagId=:hashTagId', { hashTagId: hashTagId })
      .orderBy({ 'Feeds.createdAt': 'DESC', 'Feeds.feedId': 'DESC' })
    ;
    
    // ????????? ??????
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
      //0??? ???????????? categoryId??? ?????? ?????????
      foundQuery
        .andWhere('Feeds.categoryId=:category', { category: categoryId })
        .skip(10 * (pageNumber - 1))
        .take(10);
    } else {
      //0????????? categoryId??? ?????? ????????? ?????? x
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
    // ????????? ??????
    foundQuery.leftJoinAndMapOne(
      'Feeds.likeInfo',
      Likes,
      'likes',
      'likes.profileId = :profileId and Feeds.feedId = likes.feedId',
      { profileId: profileId },
    );
    // ????????? ??????
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

  // ????????? ???????????? (????????? ?????? ??????)
  async reportFeeds(feedId: number) {
    return await this.feedTable.update(feedId, { status: 'REPORTED' });
  }

  // ????????? ????????? feed??? ?????? userId ????????????
  async getUserIdByFeedId(feedId: number) {
    return await this.feedTable
      .createQueryBuilder('Feeds')
      .leftJoinAndSelect('Feeds.profile', 'Profiles')
      .select('Profiles.userId AS userId')
      .where('Feeds.feedId=:feedId', { feedId: feedId })
      .getRawOne();
  }

  // ???????????? ?????? ????????? ???????????? ??????
  async checkFeedReported(feedId: number) {
    return await this.feedTable
      .createQueryBuilder('Feeds')
      .select('Feeds.status AS status')
      .where('Feeds.feedId=:feedId', { feedId: feedId })
      .getRawOne();
  }
}
