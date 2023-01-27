import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FeedCategoryMapping } from "./FeedCategoryMapping";

@Entity("Categories", { schema: "devDB" })
export class Categories {
  @PrimaryGeneratedColumn({ type: "int", name: "categoryId", unsigned: true })
  categoryId: number;

  @Column("varchar", { name: "categoryName", length: 45 })
  categoryName: string;

  @OneToMany(
    () => FeedCategoryMapping,
    (feedCategoryMapping) => feedCategoryMapping.category
  )
  feedCategoryMappings: FeedCategoryMapping[];
}
