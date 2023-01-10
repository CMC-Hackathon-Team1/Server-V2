import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Categories } from "./Categories";
import { Feeds } from "./Feeds";

@Index(
  "FK_FeedCategoryMapping_categoryId_Categories_categoryId",
  ["categoryId"],
  {}
)
@Entity("FeedCategoryMapping", { schema: "devDB" })
export class FeedCategoryMapping {
  @Column("int", { primary: true, name: "feedId", unsigned: true })
  feedId: number;

  @Column("int", { name: "categoryId", unsigned: true })
  categoryId: number;

  @ManyToOne(
    () => Categories,
    (categories) => categories.feedCategoryMappings,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "categoryId", referencedColumnName: "categoryId" }])
  category: Categories;

  @OneToOne(() => Feeds, (feeds) => feeds.feedCategoryMapping, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "feedId", referencedColumnName: "feedId" }])
  feed: Feeds;
}
