import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveProfileDto } from './dto/saveProfile.dto';
import { Profiles } from '../_entities/Profiles';
import { ProfileModel } from './dto/profile.model';
import { EditProfileDto } from './dto/editProfile.dto';

@Injectable()
export class ProfilesRepository {
  constructor(
    @InjectRepository(Profiles)
    private profilesTable: Repository<Profiles>,
  ) {}

  // 사용자 모든 프로필 리스트 받아오기
  async getUserProfilesList(userId: number): Promise<ProfileModel[]> {
    return await this.profilesTable.find({ where: { userId: userId } });
  }

  // 새 프로필 저장하기
  async saveNewProfile(saveProfileDto: SaveProfileDto): Promise<ProfileModel> {
    return await this.profilesTable.save(saveProfileDto);
  }

  // 프로필 ID로 프로필 찾기
  async findProfileByProfileId(profileId: number) : Promise<ProfileModel> {
    return await this.profilesTable.findOne({
      where: { profileId: profileId },
    });
  }

  // 프로필 삭제
  async deleteProfile(profileId: number) {
    return await this.profilesTable.delete(profileId);
  }

  // 프로필 업데이트 (업데이트를 수행한 후, 수정된 프로필을 return)
  async editProfile(profileId: number, editProfileDto: EditProfileDto) {
    await this.profilesTable.update(profileId, {
      profileName: editProfileDto.profileName,
      profileImgUrl: editProfileDto.profileImgUrl,
      statusMessage: editProfileDto.statusMessage
    })

    const editResult = await this.findProfileByProfileId(profileId);

    return editResult;
  }
}
