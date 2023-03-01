import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FeedHashTagMapping } from "./FeedHashTagMapping";
import { FeedImgs } from "./FeedImgs";
import { Profiles } from "./Profiles";
import { Likes } from "./Likes";
import { PostFeedRequestDTO } from "../../feeds/dto/post-feed-request.dto";
import { Categories } from "./Categories";
import { Reports } from './Reports';

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

  @Column("int", {name: "categoryId", unsigned:true})
  categoryId: number;
  
  @Column("varchar",{name:"isSecret"})
  isSecret:string;

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
    comment: "PRIVATE,PUBLIC,INACTIVE",
    length: 45,
    default: () => "PUBLIC",
  })
  status: string;

  
  @OneToMany(
    () => FeedHashTagMapping,
    (feedHashTagMapping) => feedHashTagMapping.feed
  )
  feedHashTagMappings: FeedHashTagMapping[];

  @OneToMany(() => FeedImgs, (feedImgs) => feedImgs.feed)
  feedImgs: FeedImgs[];

  @ManyToOne(() => Profiles, (profiles) => profiles.feeds, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "profileId", referencedColumnName: "profileId" }])
  profile: Profiles;

  @ManyToOne(
    () => Categories,
    (categories) => categories.feeds
  )
  @JoinColumn([{name: "categoryId",referencedColumnName:"categoryId"}])
  categories: Categories;

  @OneToMany(() => Likes, (likes) => likes.feed)
  likes: Likes[];

  @OneToMany(() => Reports, (reports) => reports.feed)
  reports: Reports[];
}
