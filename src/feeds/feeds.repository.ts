import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { profile } from 'console';
import { Repository } from 'typeorm';
import { FeedImgs } from '../common/entities/FeedImgs';
import { Feeds } from '../common/entities/Feeds';
import { Likes } from '../common/entities/Likes';

@Injectable()
export class FeedRepository {
  constructor(
    @InjectRepository(Feeds)
    private feedTable: Repository<Feeds>,
  ) {}

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
      .leftJoin('Feeds.feedCategoryMappings', 'categorymap')
      .leftJoinAndSelect('categorymap.category', 'category');

    if (categoryId != 0) {
      //0이 아닐때는 categoryId를 통한 필터링
      foundQuery
        .where('category.categoryId=:category', { category: categoryId })
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
    month: number,
    day: number,
    pageNumber: number,
  ) {
    const query = this.feedTable
      .createQueryBuilder('Feeds')
      .leftJoinAndSelect('Feeds.feedImgs', 'feedImg')
      .where('Feeds.profileId=:profileId', { profileId: profileId })
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
           where (createdAt)
                     IN (select max(createdAt)
                         from Feeds
                         where DATE_FORMAT(createdAt, "%Y-%m") = ?#이부분 parameter처리.
                         and profileId=? #이부분도 parameter처리
                         group by DATE_FORMAT(createdAt, "%Y-%m-%d"))) as sub
              LEFT JOIN (select feedId, max(feedImgUrl) as feedImgUrl from FeedImgs group by feedId) as imgSub
                        on sub.feedId = imgSub.feedId
     where ranking = 1
     order by day asc;`,[this_month,profileId]
    );
    return found;
  }

  async reportFeeds(feedId: number) {
    return await this.feedTable.update(feedId, { status: 'REPORTED' });
  }
}
