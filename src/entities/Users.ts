import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Profiles } from "./Profiles";

@Entity("Users", { schema: "devDB" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "userId", unsigned: true })
  userId: number;

  @Column("text", { name: "alarm_token", nullable: true })
  alarmToken: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 100 })
  email: string | null;

  @Column("varchar", { name: "password", nullable: true, length: 255 })
  password: string | null;

  @Column("varchar", {
    name: "status",
    comment: "ACTIVE,INACTIVE,DELETED",
    length: 45,
    default: () => "'ACTIVE'",
  })
  status: string;

  @Column("timestamp", {
    name: "createdAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToMany(() => Profiles, (profiles) => profiles.user)
  profiles: Profiles[];
}
