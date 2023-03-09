import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../common/entities/Users';
import { UserStatus } from './enum/userStatus.enum';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users)
    private usersTable: Repository<Users>,
  ) {}

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
    return await this.usersTable.update(userId, { likeAlarmStatus: 'ACTIVE' });
  }
  
  // 팔로잉 알림 수신 거부
  async setFollowingAlarmDisallow(userId: number) {
    return await this.usersTable.update(userId, { likeAlarmStatus: 'INACTIVE' });
  }
}
