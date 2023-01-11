import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Feeds } from "./Feeds";
import { FollowFromTo } from "./FollowFromTo";
import { Likes } from "./Likes";
import { ProfileHashTagMapping } from "./ProfileHashTagMapping";
import { Users } from "./Users";
import { Persona } from "./Persona";

@Index("FK_Profiles_personaId_Persona_personaId", ["personaId"], {})
@Index("FK_Profiles_userId_Users_userId", ["userId"], {})
@Entity("Profiles", { schema: "devDB" })
export class Profiles {
  @PrimaryGeneratedColumn({ type: "int", name: "profileId", unsigned: true })
  profileId: number;

  @Column("int", { name: "userId", unsigned: true })
  userId: number;

  @Column("varchar", { name: "profileName", length: 20 })
  profileName: string;

  @Column("int", { name: "personaId", unsigned: true })
  personaId: number;

  @Column("text", { name: "profileImgUrl" })
  profileImgUrl: string;

  @Column("varchar", { name: "statusMessage", length: 100 })
  statusMessage: string;

  @Column("timestamp", {
    name: "createdAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToMany(() => Feeds, (feeds) => feeds.profile)
  feeds: Feeds[];

  @OneToOne(() => FollowFromTo, (followFromTo) => followFromTo.fiomUser)
  followFromTo: FollowFromTo;

  @OneToMany(() => FollowFromTo, (followFromTo) => followFromTo.toUser)
  followFromTos: FollowFromTo[];

  @OneToMany(() => Likes, (likes) => likes.profile)
  likes: Likes[];

  @OneToOne(
    () => ProfileHashTagMapping,
    (profileHashTagMapping) => profileHashTagMapping.profile
  )
  profileHashTagMapping: ProfileHashTagMapping;

  @ManyToOne(() => Users, (users) => users.profiles, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "userId" }])
  user: Users;

  @ManyToOne(() => Persona, (persona) => persona.profiles, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "personaId", referencedColumnName: "personaId" }])
  persona: Persona;
}
