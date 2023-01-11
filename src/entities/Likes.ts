import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Profiles } from "./Profiles";
import { Feeds } from "./Feeds";

@Index("FK_Likes_feedId_Feeds_feedId", ["feedId"], {})
@Index("FK_Likes_profileId_Profiles_profileId", ["profileId"], {})
@Entity("Likes", { schema: "devDB" })
export class Likes {
  @Column("int", { name: "profileId", unsigned: true })
  profileId: number;

  @Column("timestamp", {
    name: "createdAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @PrimaryGeneratedColumn({ type: "int", name: "feedId", unsigned: true })
  feedId: number;

  @ManyToOne(() => Profiles, (profiles) => profiles.likes, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "profileId", referencedColumnName: "profileId" }])
  profile: Profiles;

  @OneToOne(() => Feeds, (feeds) => feeds.likes, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "feedId", referencedColumnName: "feedId" }])
  feed: Feeds;
}
