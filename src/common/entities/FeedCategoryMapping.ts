import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Categories } from "./Categories";
import { Feeds } from "./Feeds";

@Index(
  "FK_FeedCategoryMapping_categoryId_Categories_categoryId",
  ["categoryId"],
  {}
)
@Index("FK_FeedCategoryMapping_feedId_Feeds_feedId", ["feedId"], {})
@Entity("FeedCategoryMapping", { schema: "devDB" })
export class FeedCategoryMapping {
  @Column("int", { name: "feedId", unsigned: true })
  feedId: number;

  @Column("int", { name: "categoryId", unsigned: true })
  categoryId: number;

  @Column("int", { primary: true, name: "id", unsigned: true })
  id: number;

  @ManyToOne(
    () => Categories,
    (categories) => categories.feedCategoryMappings,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "categoryId", referencedColumnName: "categoryId" }])
  category: Categories;

  @ManyToOne(() => Feeds, (feeds) => feeds.feedCategoryMappings, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "feedId", referencedColumnName: "feedId" }])
  feed: Feeds;
}
