import { Injectable } from '@nestjs/common';
import baseResponse from '../../common/utils/baseResponseStatus';
import { errResponse, sucResponse } from '../../common/utils/response';
import { FollowingRepository } from '../../following/following.repository';
import { ProfilesRepository } from '../../profiles/profiles.repository';
import { UsersRepository } from '../../users/users.repository';
import { AlarmTokenDto } from '../dto/alarmToken.dto';

@Injectable()
export class AlarmsService {
  constructor(
    private profilesRepository: ProfilesRepository,
    private followingRepository: FollowingRepository,
    private usersRepository: UsersRepository,
  ) {}

  // 푸시알림용 토큰 받기
  async getPushAlarmToken(alarmTokenDto: AlarmTokenDto) {
    try {
        const userAlarmToken = alarmTokenDto.alarmToken;
      const userId = alarmTokenDto.userId;

      const result = await this.usersRepository.setUsersAlarmToken(userId, userAlarmToken);

      return sucResponse(baseResponse.SUCCESS);
    } catch(err) {
      return errResponse(baseResponse.DB_ERROR);
    }
  }

  // 팔로잉 알림 설정
  async followingAlarm(fromProfileId: number, toProfileId: number) {
    const targetProfile = await this.profilesRepository.findProfileByProfileId(toProfileId);
    const targetUserId = targetProfile.userId

    const targetUser = await this.usersRepository.getUserByUserId(targetUserId);
    
    if (targetUser.followAlarmStatus == 'ACTIVE') {
      const fromProfile = await this.profilesRepository.findProfileByProfileId(fromProfileId);
      const fromProfileName = fromProfile.profileName;

      /**
       * TODO
       * 임시로 console.log를 했지만 실제 토큰을 이용하는 방식으로 수정
       */
      console.log(`${fromProfileName}님이 ${targetProfile.profileName}님을 팔로우 하였습니다.`);
    }
  }

  // 공지사항 알림 설정
  async noticeAlarm() {
    const targetUsers = await this.usersRepository.getUsersForNotice();

    const targetAlarmTokens = []
    targetUsers.forEach((item) => {targetAlarmTokens.push(item.alarmToken)});

    /**
     * TODO
     * 위의 까지의 코드 = 토큰 리스트를 가져오는 작업
     * 임시로 console.log를 통해 토큰 리스트 반환을 확인
     * 
     * 실제 토큰을 이용하는 방식으로 수정
     */
    console.log(targetAlarmTokens)
  }
}
