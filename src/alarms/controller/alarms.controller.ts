import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AlarmTokenDto } from '../dto/alarmToken.dto';
import { AlarmsService } from '../service/alarms.service';

@ApiTags('Alarms')
@Controller('alarms')
export class AlarmsController {
  constructor(private alarmService: AlarmsService) {}

  @ApiOperation({
    summary: '기기별 토큰 수신',
    description: '기기별 푸시 알림을 위해 기기별 토큰을 수신할 수 있는 API입니다.\n\n(토큰이 변경될 가능성이 있는지 추가 확인이 필요합니다)\n\n1. 토큰이 변경되지 않는 경우: 토큰을 회원가입 할 때 한 번만 발급받아 서버로 전송\n\n2. 토큰이 계속 변경되는 경우: 로그인 할 때 마다 토큰을 발급받아 서버로 전송\n\n(위의 내용은 추후 변경될 수 있으르모 별도의 응답 코드가 없습니다. 테스트용을 위해 만들어둔 API이며 각 기기별 토큰을 획득하신다면 여기로 보내주시면 됩니다)'
  })
  @Post('/token')
  getPushAlarmToken(@Body() alarmTokenDto: AlarmTokenDto) {
    return this.alarmService.getPushAlarmToken(alarmTokenDto);
  }

  @ApiOperation({
    summary: '(개발 중 사용 X)',
    description: '(개발 중 사용 X)'
  })
  @Get('/notice')
  noticeAlarm() {
    return this.alarmService.noticeAlarm();
  }
}
