import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { SaveProfileDto } from './dto/saveProfile.dto';
import { Profiles } from '../common/entities/Profiles';
import { ProfileModel } from './dto/profile.model';
import { ProfileWithPersonaNameDto } from './dto/profileWithPersonaName.dto';
import { Users } from '../common/entities/Users';

@Injectable()
export class ProfilesRepository {
  
  
  constructor(
    @InjectRepository(Profiles)
    private profilesTable: Repository<Profiles>,
  ) { }
  async getBlockedProfiles(profileIdList: Array<number>) {
    return await this.profilesTable
      .createQueryBuilder('Profiles')
      .select(
        [
          'Persona.personaName',
          'Profiles.profileId',
          'Profiles.profileName',
          'Profiles.profileImgUrl'
        ]
      )
      .leftJoin('Profiles.toProfileBlocked', 'ProfileBlock')
      .leftJoin('Profiles.persona','Persona')
      .andWhere('ProfileBlock.status=:status', { status: 'HOST' })
      .andWhere('ProfileBlock.toProfileId in (:tpi)', { tpi: profileIdList })
      .getMany();
  }
  async getProfilesOfUser(userId: number) {
    return await this.profilesTable.findBy({
      userId: userId
    });
  }

  async getOne(profileId: number) {
    return await this.profilesTable.findBy({
      profileId: profileId,
    });
  }

  // 사용자 모든 프로필 리스트 받아오기
  async getUserProfilesList(userId: number): Promise<ProfileWithPersonaNameDto[]> {
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
  }

  // 사용자 프로필 페르소나 ID 목록 받아오기
  async getUserProfilePersonaIdList(userId: number): Promise<any[]> {
    return await this.profilesTable.find({where: {userId: userId}, select: ['personaId']});
  }

  // 새 프로필 저장하기
  async saveNewProfile(saveProfileDto: SaveProfileDto): Promise<ProfileModel> {
    return await this.profilesTable.save(saveProfileDto);
  }

  // 프로필 ID로 프로필 찾기
  async getProfileByProfileId(profileId: number): Promise<ProfileWithPersonaNameDto> {
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
  }

  // 프로필 삭제
  async deleteProfile(profileId: number) {
    return await this.profilesTable.delete(profileId);
  }

  // 프로필 업데이트 (업데이트를 수행한 후, 수정된 프로필을 return)
  async editProfile(profileId: number, newContent: object): Promise<UpdateResult> {
    return await this.profilesTable.update(profileId, newContent);
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
