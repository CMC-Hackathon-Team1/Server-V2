import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Likes } from "../../common/entities/Likes";
import { Between, Repository } from "typeorm";
import { Profiles } from "../../common/entities/Profiles";

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Likes)
    private likesRepository: Repository<Likes>,
    @InjectRepository(Profiles)
    private profilesRespository: Repository<Profiles>,
  ) {}

  async getMonthlyLikes(profileId: number) {
    const monthBeforeNowDate = new Date();
    monthBeforeNowDate.setDate(monthBeforeNowDate.getMonth() - 1);
    // console.log(monthBeforeNowDate);
    const likesCount = await this.likesRepository.count({
      where: {
        profileId: profileId,
        createdAt: Between(monthBeforeNowDate, new Date()),
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

  async checkProfile(userId, profileId: number) {
    const profileInfo = await this.profilesRespository.find({
      where: {
        profileId: profileId,
        userId: userId,
      },
    });
    // console.log(profileInfo);

    if (profileInfo.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}
