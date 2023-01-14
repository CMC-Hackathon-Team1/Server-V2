import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Feeds } from "./Feeds";
import { Profiles } from "./Profiles";

@Index("FK_Likes_feedId_Feeds_feedId", ["feedId"], {})
@Index("FK_Likes_profileId_Profiles_profileId", ["profileId"], {})
@Entity("Likes", { schema: "devDB" })
export class Likes {
  @Column("int", { primary: true, name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "feedId", unsigned: true })
  feedId: number;

  @Column("int", { name: "profileId", unsigned: true })
  profileId: number;

  @Column("timestamp", {
    name: "createdAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(() => Feeds, (feeds) => feeds.likes, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "feedId", referencedColumnName: "feedId" }])
  feed: Feeds;

  @ManyToOne(() => Profiles, (profiles) => profiles.likes, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "profileId", referencedColumnName: "profileId" }])
  profile: Profiles;
}
