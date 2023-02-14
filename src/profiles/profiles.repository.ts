import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveProfileDto } from './dto/saveProfile.dto';
import { Profiles } from '../common/entities/Profiles';
import { ProfileModel, ProfileResponseModel } from './dto/profile.model';

@Injectable()
export class ProfilesRepository {
  constructor(
    @InjectRepository(Profiles)
    private profilesTable: Repository<Profiles>,
  ) {}

  async getOne(profileId: number) {
    return await this.profilesTable.findBy({
      profileId: profileId,
    });
  }

  // 사용자 모든 프로필 리스트 받아오기
  async getUserProfilesList(userId: number): Promise<ProfileResponseModel[]> {
    try {
      return await this.profilesTable
        .createQueryBuilder('Profiles')
        .leftJoinAndSelect('Profiles.persona', 'Persona')
        .select([
          'Profiles.profileId AS profileId',
          'Persona.personaName AS personaName',
          'Profiles.profileName AS profileName',
          'Profiles.statusMessage AS statusMessage',
          'Profiles.profileImgUrl AS profileImgUrl',
          'Profiles.createdAt AS createdAt'
        ])
        .where('Profiles.userId=:userId', { userId: userId })
        .getRawMany();
    } catch (err) {
      console.log(err);
      throw new Error('DB_Error');
    }
  }

  // 사용자 프로필 페르소나 ID 목록 받아오기
  async getUserProfilePersonaIdList(userId: number): Promise<any[]> {
    try {
      return await this.profilesTable.find({where: {userId: userId}, select: ['personaId']});
    } catch(err) {
      // console.log(err);
      throw new Error('DB_Error');
    }
  }

  // 새 프로필 저장하기
  async saveNewProfile(saveProfileDto: SaveProfileDto): Promise<ProfileModel> {
    return await this.profilesTable.save(saveProfileDto);
  }

  // 프로필 ID로 프로필 찾기
  async findProfileByProfileId(profileId: number): Promise<ProfileResponseModel> {
    try {
      return await this.profilesTable
        .createQueryBuilder('Profiles')
        .leftJoinAndSelect('Profiles.persona', 'Persona')
        .select([
          'Profiles.profileId AS profileId',
          'Persona.personaName AS personaName',
          'Profiles.profileName AS profileName',
          'Profiles.statusMessage AS statusMessage',
          'Profiles.profileImgUrl AS profileImgUrl',
          'Profiles.createdAt AS createdAt'
        ])
        .where('Profiles.profileId=:profileId', { profileId: profileId })
        .getRawOne();
    } catch (err) {
      throw new Error('DB_Error');
    }
  }

  // 프로필 삭제
  async deleteProfile(profileId: number) {
    return await this.profilesTable.delete(profileId);
  }

  // 프로필 업데이트 (업데이트를 수행한 후, 수정된 프로필을 return)
  async editProfile(profileId: number, newContent: object): Promise<ProfileResponseModel> {
    await this.profilesTable.update(profileId, newContent);

    const editResult = await this.findProfileByProfileId(profileId);

    return editResult;
  }

  // profileId로 Profiles 테이블 row 가져오기
  async getProfileModelWithProfileId(profileId: number): Promise<ProfileModel> {
    return await this.profilesTable.findOne({ where: {profileId: profileId} });
  }

  async checkUserProfileMatch(userId: number, profileId: number) {
    return await this.profilesTable.find({
      where: {
        profileId: profileId,
        userId: userId,
      },
    });
  }
}
