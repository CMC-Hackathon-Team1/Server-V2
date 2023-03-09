import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Profiles } from './Profiles';
import { ApiProperty } from '@nestjs/swagger';
import { Reports } from './Reports';

@Entity("Users", { schema: "devDB" })
export class Users {
  @ApiProperty({ description: '유저 ID' })
  @PrimaryGeneratedColumn({ type: "int", name: "userId", unsigned: true })
  userId: number;

  @ApiProperty({ description: '알림 설정 토큰 (임시)' })
  @Column("text", { name: "alarm_token", nullable: true })
  alarmToken: string | null;

  @ApiProperty({ description: '이메일' })
  @Column("varchar", { name: "email", nullable: true, length: 100 })
  email: string | null;

  @ApiProperty({ description: '비밀번호' })
  @Column("text", { name: "password", nullable: true })
  password: string | null;

  @ApiProperty({ description: '로그인 종류 (자체, 카카오, 구글, 애플)' })
  @Column("varchar", { name: "login_type", nullable: true })
  login_type: string | null;

  @ApiProperty({ description: '소셜로그인 API를 요청/사용하기 위한 소셜 액세스 토큰' })
  @Column("text", { name: "access_token", nullable: true })
  access_token: string | null;

  @ApiProperty({ description: '소셜 계정 사용자 인증 정보가 담긴 소셜 id 토큰' })
  @Column("text", { name: "provider_token", nullable: true })
  provider_token: string | null;

  @ApiProperty({ description: '생성 날짜' })
  @Column("timestamp", {
    name: "createdAt",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @ApiProperty({
    description: '회원 상태',
    enum: ['ACTIVE', 'INACTIVE', 'HIDDEN', 'PENDING'],
    default: 'ACTIVE',
  })
  @Column("varchar", {
    name: "status",
    nullable: true,
    length: 45,
    default: () => "'ACTIVE'",
  })
  status: string | null;

  @Column("varchar", {
    name: "follow_alarm_status",
    nullable: true,
    comment: "팔로우 알림 설정 여부",
    length: 20,
    default: () => "'ACTIVE'",
  })
  followAlarmStatus: string | null;

  @Column("varchar", {
    name: "notice_alarm_status",
    comment: "공지사항 알림 설정 여부",
    length: 20,
    default: () => "'ACTIVE'",
  })
  noticeAlarmStatus: string;

  @Column("varchar", {
    name: "like_alarm_status",
    comment: "좋아요 알림 설정 여부",
    length: 20,
    default: () => "'ACTIVE'",
  })
  likeAlarmStatus: string;

  @OneToMany(() => Profiles, (profiles) => profiles.user)
  profiles: Profiles[];

  @OneToMany(() => Reports, (reports) => reports.user)
  reports: Reports[];
}
