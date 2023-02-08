import { Body, Controller, Get, Post } from '@nestjs/common';
import { AlarmTokenDto } from '../dto/alarmToken.dto';
import { AlarmsService } from '../service/alarms.service';

@Controller('alarms')
export class AlarmsController {
  constructor(private alarmService: AlarmsService) {}

  @Post('/token')
  getPushAlarmToken(@Body() alarmTokenDto: AlarmTokenDto) {
    return this.alarmService.getPushAlarmToken(alarmTokenDto);
  }

  @Get('/notice')
  noticeAlarm() {
    return this.alarmService.noticeAlarm();
  }
}
