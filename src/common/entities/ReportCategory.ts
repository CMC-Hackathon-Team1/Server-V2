import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Reports } from "./Reports";

@Entity("ReportCategory", { schema: "devDB" })
export class ReportCategory {
  @PrimaryGeneratedColumn({ type: "tinyint", name: "reportedCategoryId" })
  reportedCategoryId: number;

  @Column("varchar", { name: "categoryName", length: 50 })
  categoryName: string;

  @Column("varchar", { name: "status", length: 10 })
  status: string;

  @OneToMany(() => Reports, (reports) => reports.reportedCategory)
  reports: Reports[];
}
