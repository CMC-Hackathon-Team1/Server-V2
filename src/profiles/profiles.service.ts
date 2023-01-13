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
    private personaRepository: PersonaRepository
  ) {}

  async createProfile(createProfileDto: CreateProfileDto): Promise<any> {
    const userProfilesList = await this.profileRepository.getUserProfilesList(createProfileDto.userId);
    const newProfilePersonaName = createProfileDto.personaName;

    // 프로필 갯수 validation
    if (userProfilesList.length >= 3) {
      return errResponse(baseResponse.PROFILE_COUNT_OVER, {'currentProfileCount': userProfilesList.length});
    }

    // 같은 페르소나 생성 validation
    const existPersonaId = await this.personaRepository.getPersonaByName(newProfilePersonaName);
    for(let i = 0; i < userProfilesList.length; i++) {
      if (existPersonaId?.personaId === userProfilesList[i].personaId) {
        return errResponse(baseResponse.PROFILE_SAME_PERSONA);
      }
    }

    // 존재하는 페르소나 확인 및 미존재 페르소나 추가
    let check = 0;
    const personaList = await this.personaRepository.getPersonaList();
    for (let i = 0; i < personaList.length; i++) {
      // 페르소나 리스트에 있는 페르소나 이름들과 생성할 프로필의 페르소나 이름이 같은 경우
      if (personaList[i].personaName === newProfilePersonaName) {
        check = 1;
        break;
      }
    }
    // 페르소나가 존재하지 않으면 생성
    if (check === 0) {
      await this.personaRepository.createPersona({ personaName: newProfilePersonaName });
    }

    // 새로운 프로필 생성
    const newProfilePersonaId = (await this.personaRepository.getPersonaByName(newProfilePersonaName)).personaId;
    const newProfileDto: SaveProfileDto = {
      userId: createProfileDto.userId,
      profileName: createProfileDto.profileName,
      personaId: newProfilePersonaId,
      profileImgUrl: createProfileDto.profileImgUrl,
      statusMessage: createProfileDto.statusMessage
    }
    const newProfile = await this.profileRepository.saveNewProfile(newProfileDto);
    const result = {
      profileId: newProfile.profileId,
    }

    return sucResponse(baseResponse.SUCCESS, result);
  }
}
