import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Feeds } from "./Feeds";

@Index("FK_FeedImgs_feedId_Feeds_feedId", ["feedId"], {})
@Entity("FeedImgs", { schema: "devDB" })
export class FeedImgs {
  @PrimaryGeneratedColumn({ type: "int", name: "imgId", unsigned: true })
  imgId: number;

  @Column("int", { name: "feedId", unsigned: true })
  feedId: number;

  @Column("text", { name: "feedImgUrl" })
  feedImgUrl: string;

  @ManyToOne(() => Feeds, (feeds) => feeds.feedImgs, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "feedId", referencedColumnName: "feedId" }])
  feed: Feeds;
}
