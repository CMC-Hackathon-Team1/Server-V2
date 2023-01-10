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
import { FeedCategoryMapping } from "./FeedCategoryMapping";
import { FeedHashTagMapping } from "./FeedHashTagMapping";
import { FeedImgs } from "./FeedImgs";
import { Profiles } from "./Profiles";
import { Likes } from "./Likes";

@Index("FK_Feeds_profileId_Profiles_profileId", ["profileId"], {})
@Entity("Feeds", { schema: "devDB" })
export class Feeds {
  @PrimaryGeneratedColumn({ type: "int", name: "feedId", unsigned: true })
  feedId: number;

  @Column("int", { name: "profileId", unsigned: true })
  profileId: number;

  @Column("text", { name: "content" })
  content: string;

  @Column("int", { name: "likeNum", unsigned: true, default: () => "'0'" })
  likeNum: number;

  @Column("timestamp", {
    name: "createdAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp", {
    name: "updatedAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @Column("varchar", {
    name: "status",
    comment: "PRIVATE,ACTIVE",
    length: 45,
    default: () => "'ACTIVE'",
  })
  status: string;

  @OneToOne(
    () => FeedCategoryMapping,
    (feedCategoryMapping) => feedCategoryMapping.feed
  )
  feedCategoryMapping: FeedCategoryMapping;

  @OneToOne(
    () => FeedHashTagMapping,
    (feedHashTagMapping) => feedHashTagMapping.feed
  )
  feedHashTagMapping: FeedHashTagMapping;

  @OneToMany(() => FeedImgs, (feedImgs) => feedImgs.feed)
  feedImgs: FeedImgs[];

  @ManyToOne(() => Profiles, (profiles) => profiles.feeds, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "profileId", referencedColumnName: "profileId" }])
  profile: Profiles;

  @OneToMany(() => Likes, (likes) => likes.feed)
  likes: Likes[];
}
