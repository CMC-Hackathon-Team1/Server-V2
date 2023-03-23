import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Profiles } from './Profiles';
import { Reports } from './Reports';
import { UserBlock } from "./UserBlock";

@Entity("Users", { schema: "OnNOff" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "userId", unsigned: true })
  userId: number;

  @Column("varchar", { name: "email", nullable: true, length: 100 })
  email: string | null;

  @Column("text", { name: "password", nullable: true })
  password: string | null;

  @Column("varchar", {
    name: "login_type",
    comment: "own, kakao, google, apple",
    length: 50,
    default: () => "'own'",
  })
  login_type: string;

  @Column("text", {
    name: "access_token",
    nullable: true,
    comment: "소셜 로그인 API 사용을 위한 access token",
  })
  access_token: string | null;

  @Column("text", {
    name: "provider_token",
    nullable: true,
    comment: "소셜 로그인 사용자 인증 id token",
  })
  provider_token: string | null;

  @Column("text", { name: "alarm_token", nullable: true })
  alarmToken: string | null;

  @Column("timestamp", {
    name: "createdAt",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

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
    length: 20,
    default: () => "'ACTIVE'",
  })
  likeAlarmStatus: string;

  @OneToMany(() => Profiles, (profiles) => profiles.user)
  profiles: Profiles[];

  @OneToMany(() => Reports, (reports) => reports.user)
  reports: Reports[];

  @OneToMany(() => UserBlock, (userBlock) => userBlock.fromUser)
  fromUserBlocked: UserBlock[];

  @OneToMany(() => UserBlock, (userBlock) => userBlock.toUser)
  toUserBlocked: UserBlock[];
}
