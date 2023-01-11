import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Profiles } from "./Profiles";

@Entity("Users", { schema: "devDB" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "userId", unsigned: true })
  userId: number;

  @Column("text", { name: "alarm_token" })
  alarmToken: string;

  @Column("varchar", { name: "email", nullable: true, length: 255 })
  email: string | null;

  @Column("varchar", { name: "password", nullable: true, length: 255 })
  password: string | null;

  @OneToMany(() => Profiles, (profiles) => profiles.user)
  profiles: Profiles[];
}
