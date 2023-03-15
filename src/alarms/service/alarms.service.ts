import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import baseResponse from '../../common/utils/baseResponseStatus';
import { errResponse, sucResponse } from '../../common/utils/response';
import { FeedRepository } from '../../feeds/feeds.repository';
import { FollowingRepository } from '../../following/following.repository';
import { LikesRepository } from '../../likes/likes.repository';
import { ProfilesRepository } from '../../profiles/profiles.repository';
import { UsersRepository } from '../../users/users.repository';
import { AlarmStatusResponse } from '../dto/alarmStatus.dto';
import { AlarmTokenDto } from '../dto/alarmToken.dto';
import { SetAlarmDto } from '../dto/setAlarm.dto';
import AlarmContents from '../utils/alarm_contents';

@Injectable()
export class AlarmsService {
  constructor(
    private profilesRepository: ProfilesRepository,
    private usersRepository: UsersRepository,
    private likesRepository: LikesRepository,
  ) {}

  // 푸시알림용 토큰 받기
  async getPushAlarmToken(alarmTokenDto: AlarmTokenDto, req: any) {
    try {
      const userAlarmToken = alarmTokenDto.alarmToken;
      const userId = req.user.userId;

      const result = await this.usersRepository.setUsersAlarmToken(userId, userAlarmToken);

      return sucResponse(baseResponse.SUCCESS);
    } catch(err) {
      return errResponse(baseResponse.DB_ERROR);
    }
  }

  /**
   * 푸시 알림 FCM으로 메시지 및 푸시 요청 보내기 (단일 및 다수 기기)
   * 
   * Reference: https://firebase.google.com/docs/cloud-messaging/manage-topics?hl=ko#suscribe_and_unsubscribe_using_the
   * @param message 푸시 알림 메시지
   * @param targetTokenList 기기 토큰 (단일 토큰도 배열로 감싸서 전달)
   */
  async requestPushAlarmToFCM(message: object, targetTokenList: string[]) {
    const targetAlarmTokens = [];
    targetTokenList.forEach((item) => targetAlarmTokens.push(item));

    console.log(message);
    console.log(targetAlarmTokens);

    const FCMContent = {
      // ...AlarmContents.FOLLOW('작가 야옹이', '개발자 강아지'),
      // ...AlarmContents.NOTICE,
      // ...AlarmContents.FOLLOWING_NEW_FEED('작가 야옹이'),
      // ...AlarmContents.LIKE('작가 야옹이', '개발자 강아지'),
      ...message,
      tokens: targetAlarmTokens
    };

    const admin = require('firebase-admin');

    admin
      .messaging()
      .sendMulticast(FCMContent)
      .then(function (response: any) {
        console.log('test success: ', response);
      })
      .catch(function (err: any) {
        console.log('test failed: ', err)
      });
  }

  // 팔로잉 알림 설정
  async followingAlarm(fromProfileId: number, toProfileId: number) {
    const targetProfile = await this.profilesRepository.getProfileByProfileId(toProfileId);
    const targetUserId = targetProfile.userId;

    const targetUser = await this.usersRepository.getUserByUserId(targetUserId);
    
    if (targetUser.followAlarmStatus == 'ACTIVE') {
      const fromProfile = await this.profilesRepository.getProfileByProfileId(fromProfileId);
      const fromProfileName = fromProfile.profileName;
      const toProfileName = targetProfile.profileName;

      const FCMToken = [targetUser.alarmToken];

      // console.log(`${fromProfileName}님이 ${targetProfile.profileName}님을 팔로우 하였습니다.`);

      const message = AlarmContents.FOLLOW(fromProfileName, toProfileName);
      
      return this.requestPushAlarmToFCM(message, FCMToken);
    }
  }

  // 공지사항 알림 설정
  async noticeAlarm() {
    const targetUsers = await this.usersRepository.getUsersForNotice();

    const targetTokenList = [];
    targetUsers.forEach((item) => {targetTokenList.push(item.alarmToken)});

    const message = AlarmContents.NOTICE();

    return this.requestPushAlarmToFCM(message, targetTokenList);
  }

  // 좋아요 알림 설정
  async likeAlarm(fromProfileId: number, feedId: number) {
    const targetFeed = await this.likesRepository.findProfileIdByFeedId(feedId);
    const toProfileId = targetFeed.profileId;

    const targetProfile = await this.profilesRepository.getProfileByProfileId(toProfileId);
    const targetUserId = targetProfile.userId;

    const targetUser = await this.usersRepository.getUserByUserId(targetUserId);

    
    if (targetUser.likeAlarmStatus == 'ACTIVE') {
      const fromProfile = await this.profilesRepository.getProfileByProfileId(fromProfileId);
      const fromProfileName = fromProfile.profileName;
      const toProfileName = targetProfile.profileName;

      const FCMToken = [targetUser.alarmToken];

      // console.log(`${fromProfileName}님이 ${targetProfile.profileName}님을 팔로우 하였습니다.`);

      const message = AlarmContents.LIKE(fromProfileName, toProfileName);
      
      return this.requestPushAlarmToFCM(message, FCMToken);
    }
  }

  // 팔로잉 알림 수신 허용/거부
  async setFollowingAlarm(setAlarmDto: SetAlarmDto, req: any) {
    const alarmStatusCode = setAlarmDto.statusCode;
    const userId = req.user.userId;

    if (alarmStatusCode == 0) {
      await this.usersRepository.setFollowingAlarmAllow(userId);
      return sucResponse(baseResponse.SET_ALARM_ALLOW_SUCCESS);
    } else if (alarmStatusCode == 1) {
      await this.usersRepository.setFollowingAlarmDisallow(userId);
      return sucResponse(baseResponse.SET_ALARM_DISALLOW_SUCCESS);
    } else {
      return errResponse(baseResponse.STATUSCODE_NOT_VALID);
    }
  }

  // 공지사항 알림 수신 허용/거부
  async setNoticeAlarm(setAlarmDto: SetAlarmDto, req: any) {
    const alarmStatusCode = setAlarmDto.statusCode;
    const userId = req.user.userId;

    if (alarmStatusCode == 0) {
      await this.usersRepository.setNoticeAlarmAllow(userId);
      return sucResponse(baseResponse.SET_ALARM_ALLOW_SUCCESS);
    } else if (alarmStatusCode == 1) {
      await this.usersRepository.setNoticeAlarmDisallow(userId);
      return sucResponse(baseResponse.SET_ALARM_DISALLOW_SUCCESS);
    } else {
      return errResponse(baseResponse.STATUSCODE_NOT_VALID);
    }
  }

  // 좋아요 알림 수신 허용/거부
  async setLikeAlarm(setAlarmDto: SetAlarmDto, req: any) {
    const alarmStatusCode = setAlarmDto.statusCode;
    const userId = req.user.userId;

    if (alarmStatusCode == 0) {
      await this.usersRepository.setLikeAlarmAllow(userId);
      return sucResponse(baseResponse.SET_ALARM_ALLOW_SUCCESS);
    } else if (alarmStatusCode == 1) {
      await this.usersRepository.setLikeAlarmDisallow(userId);
      return sucResponse(baseResponse.SET_ALARM_DISALLOW_SUCCESS);
    } else {
      return errResponse(baseResponse.STATUSCODE_NOT_VALID);
    }
  }

  // 유저 알림 설정 상태 확인
  async getAlarmStatus(req: any) {
    const userId = req.user.userId;

    const userAlarmStatus = await this.usersRepository.getAlarmStatus(userId);
    const userAlarmStatusResult = new AlarmStatusResponse(userAlarmStatus);

    return sucResponse(baseResponse.SUCCESS, userAlarmStatusResult);
  }
}
