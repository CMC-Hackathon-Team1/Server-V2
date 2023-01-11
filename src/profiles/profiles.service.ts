import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import baseResponse from '../config/baseResponseStatus';
import { errResponse, response } from '../config/response';
import { Profiles } from '../entities/Profiles';
import { CreateProfileDto } from './createProfile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profiles)
    private profileTable: Repository<Profiles>,
  ) {}

  async createProfile(createProfileDto: CreateProfileDto): Promise<object> {
    const userProfiles = await this.getUserProfiles(createProfileDto.userId);

    // 프로필 갯수 validation
    if (userProfiles.length >= 3) {
      return errResponse(baseResponse.PROFILE_COUNT_OVER, {'currentProfileCount': userProfiles.length});
    }

    // 같은 페르소나 생성 validation
    for(let i = 0; i < userProfiles.length; i++) {
      if (createProfileDto.personaId === userProfiles[i].personaId) {
        return errResponse(baseResponse.PROFILE_SAME_PERSONA);
      }
    }

    const newProfile = await this.profileTable.save(createProfileDto);

    const result = {
      profileId: newProfile.profileId,
    };

    return response(baseResponse.SUCCESS, result);
  }

  async getUserProfiles(userId: number) {
    const userProfiles = await this.profileTable.find({ where: { userId: userId } });

    return userProfiles;
  }
}
