import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JWTAuthGuard } from '../../auth/security/auth.guard.jwt';
import baseResponse from '../../common/utils/baseResponseStatus';
import { AlarmTokenDto } from '../dto/alarmToken.dto';
import { SetAlarmDto } from '../dto/setAlarm.dto';
import { AlarmsService } from '../service/alarms.service';

@ApiTags('Alarms')
@Controller('alarms')
export class AlarmsController {
  constructor(private alarmService: AlarmsService) {}

  @ApiOperation({
    summary: '기기별 토큰 수신',
    description: '기기별 푸시 알림을 위해 기기별 토큰을 수신할 수 있는 API입니다.\n\n(토큰이 변경될 가능성이 있는지 추가 확인이 필요합니다)\n\n1. 토큰이 변경되지 않는 경우: 토큰을 회원가입 할 때 한 번만 발급받아 서버로 전송\n\n2. 토큰이 계속 변경되는 경우: 로그인 할 때 마다 토큰을 발급받아 서버로 전송\n\n(위의 내용은 추후 변경될 수 있으르모 별도의 응답 코드가 없습니다. 테스트용을 위해 만들어둔 API이며 각 기기별 토큰을 획득하신다면 여기로 보내주시면 됩니다)'
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JWTAuthGuard)
  @Post('/token')
  getPushAlarmToken(@Body() alarmTokenDto: AlarmTokenDto, @Req() req: any) {
    return this.alarmService.getPushAlarmToken(alarmTokenDto, req);
  }

  @ApiOperation({
    summary: '관리자 전용 API',
    description: '관리자가 해당 URI로 GET 요청을 보내면 공지사항이 추가되었다는 푸시 알림이 일괄 전송되는 기능'
  })
  @Get('/notice')
  noticeAlarm() {
    return this.alarmService.noticeAlarm();
  }

  /**
   * 푸시 알림 테스트용 경로
   * FCM으로 메시지 보내는 기능
   * 현재 임시 토큰을 사용하므로 유효하지 않은 토큰이라는 에러 메시지 출력
   */
  @ApiOperation({
    summary: '(개발 중 사용 X)',
    description: '(개발 중 사용 X) 백엔드 FCM으로 푸시 알림 요청 테스트용 경로'
  })
  @Get('/test')
  pushAlarmTest() {
    return this.alarmService.likeAlarm(29, 29);
  }

  // 팔로잉 알림 수신/미수신 설정
  @ApiOperation({
    summary: '팔로잉 알림 설정을 변경할 수 있는 API',
    description: '0: 알림 수신 거부 / 1: 알림 수신 허용 (Type: number)'
  })
  @ApiResponse({
    status: 3501,
    description: '알림 수신 설정 완료',
    schema: { example: baseResponse.SET_ALARM_ALLOW_SUCCESS },
  })
  @ApiResponse({
    status: 3502,
    description: '알림 수신 거부 완료',
    schema: { example: baseResponse.SET_ALARM_DISALLOW_SUCCESS },
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JWTAuthGuard)
  @Patch('/following')
  setFollowingAlarm(@Body() setAlarmDto: SetAlarmDto, @Req() req: any) {
    return this.alarmService.setFollowingAlarm(setAlarmDto, req);
  }

  // 공지사항 알림 수신/미수신 설정
  @ApiOperation({
    summary: '공지사항 알림 설정을 변경할 수 있는 API',
    description: '0: 알림 수신 거부 / 1: 알림 수신 허용 (Type: number)'
  })
  @ApiResponse({
    status: 3501,
    description: '알림 수신 설정 완료',
    schema: { example: baseResponse.SET_ALARM_ALLOW_SUCCESS },
  })
  @ApiResponse({
    status: 3502,
    description: '알림 수신 거부 완료',
    schema: { example: baseResponse.SET_ALARM_DISALLOW_SUCCESS },
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JWTAuthGuard)
  @Patch('/notice')
  setNoticeAlarm(@Body() setAlarmDto: SetAlarmDto, @Req() req: any) {
    return this.alarmService.setNoticeAlarm(setAlarmDto, req);
  }

  // 좋아요 알림 수신/미수신 설정
  @ApiOperation({
    summary: '좋아요 알림 설정을 변경할 수 있는 API',
    description: '0: 알림 수신 거부 / 1: 알림 수신 허용 (Type: number)'
  })
  @ApiResponse({
    status: 3501,
    description: '알림 수신 설정 완료',
    schema: { example: baseResponse.SET_ALARM_ALLOW_SUCCESS },
  })
  @ApiResponse({
    status: 3502,
    description: '알림 수신 거부 완료',
    schema: { example: baseResponse.SET_ALARM_DISALLOW_SUCCESS },
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JWTAuthGuard)
  @Patch('/like')
  setLikeAlarm(@Body() setAlarmDto: SetAlarmDto, @Req() req: any) {
    return this.alarmService.setLikeAlarm(setAlarmDto, req);
  }

}
