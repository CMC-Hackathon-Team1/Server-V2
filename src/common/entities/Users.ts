import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Profiles } from './Profiles';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ description: '소셜로그인 토큰 (accessToken or idToken' })
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
    enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
    default: 'ACTIVE',
  })
  @Column("varchar", {
    name: "status",
    nullable: true,
    length: 45,
    default: () => "'ACTIVE'",
  })
  status: string | null;

  @Column("varchar", { name: "follow_alarm_status", nullable: false, length: 20 })
  followAlarmStatus: string;

  @Column("varchar", { name: "notice_alarm_status", nullable: false, length: 20 })
  noticeAlarmStatus: string;

  @OneToMany(() => Profiles, (profiles) => profiles.user)
  profiles: Profiles[];
}
