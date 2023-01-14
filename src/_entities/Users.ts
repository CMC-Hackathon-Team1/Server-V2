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

  @Column("text", { name: "password", nullable: true })
  password: string | null;

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

  @OneToMany(() => Profiles, (profiles) => profiles.user)
  profiles: Profiles[];
}
