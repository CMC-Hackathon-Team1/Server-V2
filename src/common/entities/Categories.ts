import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Feeds } from "./Feeds";

@Entity("Categories", { schema: "devDB" })
export class Categories {
  @PrimaryGeneratedColumn({ type: "int", name: "categoryId", unsigned: true })
  categoryId: number;

  @Column("varchar", { name: "categoryName", length: 45 })
  categoryName: string;

  @OneToMany(
    () => Feeds,
    (feeds) => feeds.categories
  )
  feeds: Feeds[];
}
