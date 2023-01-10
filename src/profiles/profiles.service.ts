import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import baseResponse from 'src/config/baseResponseStatus';
import { errResponse, response } from 'src/config/response';
import { Profiles } from 'src/entities/Profiles';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './createProfile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profiles)
    private profileTable: Repository<Profiles>,
  ) {}

  async createProfile(createProfileDto: CreateProfileDto): Promise<object> {
    // 프로필 갯수 validation
    const userProfileCount = await this.getProfile(createProfileDto.userId);
    if (userProfileCount.length >= 3) {
      return errResponse(baseResponse.PROFILE_COUNT_OVER, {'currentProfileCount': userProfileCount.length});
    }

    const newProfile = await this.profileTable.save(createProfileDto);

    const result = {
      profileId: newProfile.profileId,
    };

    return response(baseResponse.SUCCESS, result);
  }

  async getProfile(userId: number) {
    const userProfiles = await this.profileTable.find({ where: { userId: userId } });

    return userProfiles;
  }
}
