import { Injectable } from '@nestjs/common';
import { PersonaRepository } from '../../persona/persona.repository';
import { SaveProfileDto } from '../dto/saveProfile.dto';
import baseResponse from '../../common/utils/baseResponseStatus';
import { errResponse, sucResponse } from '../../common/utils/response';
import { CreateProfileDto } from '../dto/createProfile.dto';
import { ProfilesRepository } from '../profiles.repository';
import { EditProfileDto } from '../dto/editProfile.dto';
import { AwsService } from '../../aws/aws.service';

@Injectable()
export class ProfilesService {
  constructor(
    private profileRepository: ProfilesRepository,
    private personaRepository: PersonaRepository,
    private readonly AwsService: AwsService,
  ) {}

  // 프로필 생성
  async createProfile(image: Express.Multer.File, req: any, createProfileDto: CreateProfileDto): Promise<any> {
    const requestUserId = req.user.userId;
    const userProfilesList = await this.profileRepository.getUserProfilesList(requestUserId);
    const newProfilePersonaName = createProfileDto.personaName;
    
    // 프로필 갯수 validation
    if (userProfilesList.length >= 3) {
      return errResponse(baseResponse.PROFILE_COUNT_OVER, {
        currentProfileCount: userProfilesList.length,
      });
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
    if (checkExistPerona === undefined) {
      // 아무도 해당 페르소나를 이용하지 않는 경우
      const newPersona = await this.personaRepository.createPersona({
        personaName: newProfilePersonaName,
      });
      newProfilePeronaId = newPersona.personaId;
    }
    
    // 새로운 프로필 생성
    let imgDir = '';
    // 사용자가 이미지를 전달한 경우
    if (image) {
      const imageUploadResult = await this.AwsService.uploadFileToS3('imageTest', image);
      imgDir = imageUploadResult.key;
    }
    else {
      imgDir = process.env.DEFAULT_PROFILE_IMAGE_DIR;
    }
    const newProfileDto: SaveProfileDto = {
      userId: requestUserId,
      profileName: createProfileDto.profileName,
      personaId: newProfilePeronaId,
      profileImgUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${imgDir}`,
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
  async deleteProfile(req: any, profileId: number) {
    try {
      const requestUserId = req.user.userId;
      const targetProfile = await this.profileRepository.findProfileByProfileId(profileId);

      // 요청의 userId와 삭제 대상 프로필의 userId가 다른 경우
      if (targetProfile?.userId !== requestUserId) {
        return errResponse(baseResponse.PROFILE_NO_AUTHENTICATION);
      }
      
      // profileId에 해당하는 프로필이 없는 경우
      if (!targetProfile) {
        return errResponse(baseResponse.PROFILE_NOT_EXIST);
      }
      
      await this.profileRepository.deleteProfile(profileId);

      return sucResponse(baseResponse.SUCCESS);
    } catch (error) {
      return errResponse(baseResponse.DB_ERROR);
    }
  }

  // 프로필 수정
  async editProfile(req: any, profileId: number, editProfileDto: EditProfileDto) {
    try {
      const requestUserId = req.user.userId;
      const targetProfile = await this.profileRepository.findProfileByProfileId(profileId);

      if (targetProfile?.userId !== requestUserId) {
        return errResponse(baseResponse.PROFILE_NO_AUTHENTICATION);
      }

      // 해당 프로필이 존재하지 않는 경우
      if (!targetProfile) {
        return errResponse(baseResponse.PROFILE_NOT_EXIST);
      }

      const editedProfile = await this.profileRepository.editProfile(profileId, editProfileDto);
      delete editedProfile.userId;

      return sucResponse(baseResponse.SUCCESS, editedProfile);
    } catch (error) {
      return errResponse(baseResponse.DB_ERROR);
    }
  }

  // 프로필 ID로 프로필 가져오기
  async getProfileByProfileId(profileId: number) {
    try {
      const result = await this.profileRepository.findProfileByProfileId(profileId);

      if (!result) {
        return errResponse(baseResponse.PROFILE_NOT_EXIST);
      }

      delete result.userId;

      return sucResponse(baseResponse.SUCCESS, result);
    } catch (error) {
      return errResponse(baseResponse.DB_ERROR);
    }
  }

  // 사용자의 모든 프로필 가져오기
  async getUserProfilesList(req: any) {
    try {
      const requestUserId = req.user.userId;
      const profileList = await this.profileRepository.getUserProfilesList(requestUserId);

      // 사용자의 프로필이 존재하지 않는 경우
      if (profileList.length === 0) {
        return errResponse(baseResponse.USER_NO_PROFILE);
      }

      return sucResponse(baseResponse.SUCCESS, profileList);
    } catch (error) {
      return errResponse(baseResponse.DB_ERROR);
    }
  }
}