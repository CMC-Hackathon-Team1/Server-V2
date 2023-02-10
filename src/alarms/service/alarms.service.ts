import { Injectable } from '@nestjs/common';
import baseResponse from '../../common/utils/baseResponseStatus';
import { errResponse, sucResponse } from '../../common/utils/response';
import { FollowingRepository } from '../../following/following.repository';
import { ProfilesRepository } from '../../profiles/profiles.repository';
import { UsersRepository } from '../../users/users.repository';
import { AlarmTokenDto } from '../dto/alarmToken.dto';
import AlarmContents from '../utils/alarm_contents';

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

  // 푸시 알림 FCM으로 메시지 및 푸시 요청 보내기
  async requestPushAlarmToFCM(message: object, targetToken: string) {
    const FCMContent = {
      // ...AlarmContents.FOLLOW('작가 야옹이', '개발자 강아지'),
      // ...AlarmContents.NOTICE,
      // ...AlarmContents.FOLLOWING_NEW_FEED('작가 야옹이'),
      // ...AlarmContents.LIKE('작가 야옹이', '개발자 강아지'),
      ...message,
      token: targetToken
    };

    console.log(FCMContent);

    const admin = require('firebase-admin');

    admin
      .messaging()
      .send(FCMContent)
      .then(function (response: any) {
        console.log('test success: ', response);
      })
      .catch(function (err: any) {
        console.log('test failed: ', err)
      });
  }

  // 팔로잉 알림 설정
  async followingAlarm(fromProfileId: number, toProfileId: number) {
    const targetProfile = await this.profilesRepository.findProfileByProfileId(toProfileId);
    const targetUserId = targetProfile.userId

    const targetUser = await this.usersRepository.getUserByUserId(targetUserId);
    
    if (targetUser.followAlarmStatus == 'ACTIVE') {
      const fromProfile = await this.profilesRepository.findProfileByProfileId(fromProfileId);
      const fromProfileName = fromProfile.profileName;
      const toProfileName = targetProfile.profileName;

      const FCMToken = targetUser.alarmToken;

      // console.log(`${fromProfileName}님이 ${targetProfile.profileName}님을 팔로우 하였습니다.`);

      const message = AlarmContents.FOLLOW(fromProfileName, toProfileName);
      
      return this.requestPushAlarmToFCM(message, FCMToken);
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
