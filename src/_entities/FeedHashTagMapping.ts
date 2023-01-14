import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Feeds } from "./Feeds";
import { HashTags } from "./HashTags";

@Index("FK_FeedHashTagMapping_hashTagId_HashTags_hashTagId", ["hashTagId"], {})
@Index("FK_FeedHashTagMapping_feedId_Feeds_feedId", ["feedId"], {})
@Entity("FeedHashTagMapping", { schema: "devDB" })
export class FeedHashTagMapping {
  @Column("int", { name: "feedId", unsigned: true })
  feedId: number;

  @Column("int", { name: "hashTagId", unsigned: true })
  hashTagId: number;

  @Column("int", { primary: true, name: "id", unsigned: true })
  id: number;

  @ManyToOne(() => Feeds, (feeds) => feeds.feedHashTagMappings, {
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
