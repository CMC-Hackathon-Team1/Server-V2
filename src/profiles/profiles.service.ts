import { Injectable } from '@nestjs/common';
import baseResponse from '../_utilities/baseResponseStatus';
import { errResponse, sucResponse } from '../_utilities/response';
import { CreateProfileDto } from './createProfile.dto';
import { ProfilesRepository } from './profiles.repository';

@Injectable()
export class ProfilesService {
  constructor(
    private profileRepository: ProfilesRepository,
  ) {}

  async createProfile(createProfileDto: CreateProfileDto): Promise<object> {
    const userProfilesList = await this.profileRepository.getUserProfilesList(createProfileDto.userId);

    // 프로필 갯수 validation
    if (userProfilesList.length >= 3) {
      return errResponse(baseResponse.PROFILE_COUNT_OVER, {'currentProfileCount': userProfilesList.length});
    }

    // 같은 페르소나 생성 validation
    for(let i = 0; i < userProfilesList.length; i++) {
      if (createProfileDto.personaId === userProfilesList[i].personaId) {
        return errResponse(baseResponse.PROFILE_SAME_PERSONA);
      }
    }

    // TODO: 존재하지 않는 페르소나(페르소나 ID가 유효하지 않은 페르소나)로 생성하는 경우에 대한 validation 추가

    const newProfile = await this.profileRepository.saveNewProfile(createProfileDto);
    const result = {
      profileId: newProfile.profileId,
    }

    return sucResponse(baseResponse.SUCCESS, result);
  }
}
