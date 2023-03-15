import { ApiProperty } from "@nestjs/swagger";

export class AlarmStatusDto {
  followAlarmStatus: string;

  likeAlarmStatus: string;

  noticeAlarmStatus: string;
}

export class AlarmStatusResponse {
  constructor(AlarmStatusDto: AlarmStatusDto) {
    AlarmStatusDto.followAlarmStatus == 'ACTIVE' ? this.followAlarmStatus = true : this.followAlarmStatus = false;
    AlarmStatusDto.likeAlarmStatus == 'ACTIVE' ? this.likeAlarmStatus = true : this.likeAlarmStatus = false;
    AlarmStatusDto.noticeAlarmStatus == 'ACTIVE' ? this.noticeAlarmStatus = true : this.noticeAlarmStatus = false;
  }

  @ApiProperty({
    description: '팔로잉 알람 설정 여부',
    example: true
  })
  followAlarmStatus: boolean;

  @ApiProperty({
    description: '좋아요 알람 설정 여부',
    example: true
  })
  likeAlarmStatus: boolean;

  @ApiProperty({
    description: '공지사항 알람 설정 여부',
    example: true
  })
  noticeAlarmStatus: boolean;
}

export const AlarmStatusResponseExample = {
  followAlarmStatus: true,
  likeAlarmStatus: true,
  noticeAlarmStatus: true,
}