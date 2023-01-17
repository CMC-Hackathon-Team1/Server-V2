import { Injectable } from '@nestjs/common';
import { PersonaRepository } from '../persona/persona.repository';
import { SaveProfileDto } from './saveProfile.dto';
import baseResponse from '../_utilities/baseResponseStatus';
import { errResponse, sucResponse } from '../_utilities/response';
import { CreateProfileDto } from './createProfile.dto';
import { ProfilesRepository } from './profiles.repository';

@Injectable()
export class ProfilesService {
  constructor(
    private profileRepository: ProfilesRepository,
    private personaRepository: PersonaRepository,
  ) {}

  // 프로필 생성
  async createProfile(createProfileDto: CreateProfileDto): Promise<any> {
    const userProfilesList = await this.profileRepository.getUserProfilesList(createProfileDto.userId);
    const newProfilePersonaName = createProfileDto.personaName;

    // 프로필 갯수 validation
    if (userProfilesList.length >= 3) {
      return errResponse(baseResponse.PROFILE_COUNT_OVER, {'currentProfileCount': userProfilesList.length});
    }

    // 같은 페르소나 생성 validation
    const checkExistPerona = await this.personaRepository.getPersonaByName(newProfilePersonaName);

    // existPersonaId = 페르소나 테이블에 해당 페르소나가 존재하는 경우: 해당 페르소나 ID 사용 / 존재하지 않는 경우: 새로운 페르소나를 생성하여 생성된 페르소나 ID를 사용
    // existPersonaId를 이용해 프로필 생성에 필요한 personaId 저장
    const existPersonaId = checkExistPerona?.personaId; // checkExistPersona가 undefined인 경우가 있을 수 있으므로 ? 부여
    for (let i = 0; i < userProfilesList.length; i++) {
      if (existPersonaId === userProfilesList[i].personaId) {
        return errResponse(baseResponse.PROFILE_SAME_PERSONA);
      }
    }

    // 아무도 사용하지 않은 새로운 페르소나인 경우 페르소나를 생성한 후 생성된 페르소나 ID를 이용하여 프로필을 생성
    let newProfilePeronaId = existPersonaId;
    if (checkExistPerona === undefined) { // 아무도 해당 페르소나를 이용하지 않는 경우
      const newPersona = await this.personaRepository.createPersona({ personaName: newProfilePersonaName });
      newProfilePeronaId = newPersona.personaId;
    }

    // 새로운 프로필 생성
    const newProfileDto: SaveProfileDto = {
      userId: createProfileDto.userId,
      profileName: createProfileDto.profileName,
      personaId: newProfilePeronaId,
      profileImgUrl: createProfileDto.profileImgUrl,
      statusMessage: createProfileDto.statusMessage,
    };
    const newProfile = await this.profileRepository.saveNewProfile(
      newProfileDto,
    );
    const result = {
      profileId: newProfile.profileId,
    };

    return sucResponse(baseResponse.SUCCESS, result);
  }

  // 프로필 삭제
  async deleteProfile(profileId: number) {
    const targetProfile = await this.profileRepository.findProfileByProfileId(profileId,);

    // 삭제하려는 프로필이 존재하지 않는 경우
    if (!targetProfile) {
      return errResponse(baseResponse.PROFILE_NOT_EXIST);
    }

    try {
      await this.profileRepository.deleteProfile(targetProfile);
      
      return sucResponse(baseResponse.SUCCESS);
    } catch (error) {
      return errResponse(baseResponse.DB_ERROR);
    }
  }
}
