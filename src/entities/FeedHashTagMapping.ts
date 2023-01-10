import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Feeds } from "./Feeds";
import { HashTags } from "./HashTags";

@Index("FK_FeedHashTagMapping_hashTagId_HashTags_hashTagId", ["hashTagId"], {})
@Entity("FeedHashTagMapping", { schema: "devDB" })
export class FeedHashTagMapping {
  @Column("int", { primary: true, name: "feedId", unsigned: true })
  feedId: number;

  @Column("int", { name: "hashTagId", unsigned: true })
  hashTagId: number;

  @OneToOne(() => Feeds, (feeds) => feeds.feedHashTagMapping, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "feedId", referencedColumnName: "feedId" }])
  feed: Feeds;

  @ManyToOne(() => HashTags, (hashTags) => hashTags.feedHashTagMappings, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "hashTagId", referencedColumnName: "hashTagId" }])
  hashTag: HashTags;
}
