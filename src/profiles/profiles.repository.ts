import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveProfileDto } from './saveProfile.dto';
import { Profiles } from '../_entities/Profiles';
import { ProfileModel } from './profile.model';

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
  async findProfileByProfileId(profileId: number) {
    return await this.profilesTable.findOne({
      where: { profileId: profileId },
    });
  }

  // 프로필 삭제
  async deleteProfile(profileId: number) {
    return await this.profilesTable.delete(profileId);
  }
}
