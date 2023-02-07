import { Controller, Get } from '@nestjs/common';
import { AlarmsService } from '../service/alarms.service';

@Controller('alarms')
export class AlarmsController {
  constructor(private alarmService: AlarmsService) {}

  @Get('/notice')
  noticeAlarm() {
    return this.alarmService.noticeAlarm();
  }
}
