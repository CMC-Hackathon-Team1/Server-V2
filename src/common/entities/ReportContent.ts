import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Reports } from "./Reports";

@Entity("ReportContent", { schema: "devDB" })
export class ReportContent {
  @PrimaryGeneratedColumn({ type: "int", name: "contentId", unsigned: true })
  contentId: number;

  @Column("varchar", { name: "content", length: 20 })
  content: string;

  @OneToMany(() => Reports, (reports) => reports.content)
  reports: Reports[];
}
