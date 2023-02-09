import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Likes } from '../../common/entities/Likes';
import { Between, Repository } from 'typeorm';
import { Profiles } from '../../common/entities/Profiles';
import { Feeds } from '../../common/entities/Feeds';
import { FollowFromTo } from "../../common/entities/FollowFromTo";

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Likes)
    private likesRepository: Repository<Likes>,
    @InjectRepository(Profiles)
    private profilesRepository: Repository<Profiles>,
    @InjectRepository(Feeds)
    private feedsRepository: Repository<Feeds>,
    @InjectRepository(FollowFromTo)
    private followRepository: Repository<FollowFromTo>,
  ) {}

  async getMonthlyLikes(profileId: number, monthBeforeNow: Date, now: Date) {
    const likesCount = await this.likesRepository.count({
      where: {
        profileId: profileId,
        createdAt: Between(monthBeforeNow, now),
      },
    });
    // console.log(likesCount);
    // const likesCount = await this.likesRepository
    //   .createQueryBuilder('likes')
    //   .where('likes.profileId = :id', { id: profileId })
    //   .andWhere('likes.createdAt >= :monthAgo', { monthAgo: monthBeforeNowDate })
    //   .getMany();
    // console.log(likesCount.length);

    return likesCount;
  }

  async getMonthlyFeeds(profileId: number, monthBeforeNow: Date, now: Date) {
    const myFeedsCount = await this.feedsRepository.count({
      where: {
        profileId: profileId,
        createdAt: Between(monthBeforeNow, now),
      },
    });
    // console.log(likesCount);
    // const likesCount = await this.likesRepository
    //   .createQueryBuilder('likes')
    //   .where('likes.profileId = :id', { id: profileId })
    //   .andWhere('likes.createdAt >= :monthAgo', { monthAgo: monthBeforeNowDate })
    //   .getMany();
    // console.log(likesCount.length);

    return myFeedsCount;
  }

  async getMonthlyFollowers(profileId: number, monthBeforeNow: Date, now: Date) {
    const myFollowersCount = await this.followRepository.count({
      where: {
        toUserId: profileId,
        createdAt: Between(monthBeforeNow, now),
      },
    });
    // console.log(likesCount);
    // const likesCount = await this.likesRepository
    //   .createQueryBuilder('likes')
    //   .where('likes.profileId = :id', { id: profileId })
    //   .andWhere('likes.createdAt >= :monthAgo', { monthAgo: monthBeforeNowDate })
    //   .getMany();
    // console.log(likesCount.length);

    return myFollowersCount;
  }
}
