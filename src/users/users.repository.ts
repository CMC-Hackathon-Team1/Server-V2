import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlarmStatusDto } from '../alarms/dto/alarmStatus.dto';
import { Users } from '../common/entities/Users';
import { UserStatus } from './enum/userStatus.enum';

@Injectable()
export class UsersRepository {
  
  
  constructor(
    @InjectRepository(Users)
    private usersTable: Repository<Users>,
  ) {}

  async getUserByProfileId(toProfileId: number) {
    return await this.usersTable
      .createQueryBuilder('Users')
      .leftJoin('Users.profiles', 'profiles')
      .where('profiles.profileId=:toProfileId', { toProfileId: toProfileId })
      .getOne();
  }
  
  // 유저 삭제
  async deleteUserByUserId(userId: number) {
    return await this.usersTable.delete(userId);
  }

  // 유저 정보 가져오기
  async getUserByUserId(userId: number) {
    return await this.usersTable.findOne({ where: { userId: userId } });
  }

  // 계정 공개상태 변경
  async changeUserStatus(userStatus: UserStatus, userId: number) {
    return await this.usersTable.update(userId, { status: userStatus });
  }

  // 공지사항 알림 설정 되어있는 모든 유저 정보 가져오기
  async getUsersForNotice() {
    return await this.usersTable.find({ select: [ 'alarmToken' ], where: { noticeAlarmStatus: 'ACTIVE' } });
  }

  // 기기별 푸시 알림 토큰 저장
  async setUsersAlarmToken(userId: number, alarmToken: string) {
    return await this.usersTable.update(userId, { alarmToken: alarmToken });
  }

  // 회원 이메일 정보 가져오기
  async getUserEmailById(userId: number) {
    return await this.usersTable.findOne({ select: ['email'], where: { userId: userId }});
  }

  // 팔로잉 알림 수신 설정
  async setFollowingAlarmAllow(userId: number) {
    return await this.usersTable.update(userId, { followAlarmStatus: 'ACTIVE' });
  }
  
  // 팔로잉 알림 수신 거부
  async setFollowingAlarmDisallow(userId: number) {
    return await this.usersTable.update(userId, { followAlarmStatus: 'INACTIVE' });
  }

  // 공지사항 알림 수신 설정
  async setNoticeAlarmAllow(userId: number) {
    return await this.usersTable.update(userId, { noticeAlarmStatus: 'ACTIVE' });
  }
  
  // 공지사항 알림 수신 거부
  async setNoticeAlarmDisallow(userId: number) {
    return await this.usersTable.update(userId, { noticeAlarmStatus: 'INACTIVE' });
  }

  // 좋아요 알림 수신 설정
  async setLikeAlarmAllow(userId: number) {
    return await this.usersTable.update(userId, { likeAlarmStatus: 'ACTIVE' });
  }
  
  // 좋아요 알림 수신 거부
  async setLikeAlarmDisallow(userId: number) {
    return await this.usersTable.update(userId, { likeAlarmStatus: 'INACTIVE' });
  }

  // 유저 알림설정 여부
  async getAlarmStatus(userId: number): Promise<AlarmStatusDto> {
    return await this.usersTable.findOne({ select: ['followAlarmStatus', 'likeAlarmStatus', 'noticeAlarmStatus'], where: { userId: userId } });
  }
}
