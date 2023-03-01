import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ReportContent } from "./ReportContent";
import { Feeds } from "./Feeds";
import { ReportCategory } from "./ReportCategory";
import { Users } from "./Users";

@Index(
  "FK_Reports_reportedCategoryId_ReportCategory_reportedCategoryId",
  ["reportedCategoryId"],
  {}
)
@Index("FK_Reports_userId_Users_userId", ["userId"], {})
@Index("FK_Reports_contentId_ReportContent_contentId", ["contentId"], {})
@Index("FK_Reports_feedId_Feeds_feedId", ["feedId"], {})
@Entity("Reports", { schema: "devDB" })
export class Reports {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("tinyint", { name: "reportedCategoryId" })
  reportedCategoryId: number;

  @Column("int", { name: "userId", unsigned: true })
  userId: number;

  @Column("int", { name: "feedId", unsigned: true })
  feedId: number;

  @Column("int", { name: "contentId", nullable: true, unsigned: true })
  contentId: number | null;

  @Column("varchar", {
    name: "status",
    comment: "CHECKED,UNCHECKED,DONE",
    length: 10,
    default: () => "'UNCHECKED'",
  })
  status: string;

  @ManyToOne(() => ReportContent, (reportContent) => reportContent.reports, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "contentId", referencedColumnName: "contentId" }])
  content: ReportContent;

  @ManyToOne(() => Feeds, (feeds) => feeds.reports, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "feedId", referencedColumnName: "feedId" }])
  feed: Feeds;

  @ManyToOne(() => ReportCategory, (reportCategory) => reportCategory.reports, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([
    { name: "reportedCategoryId", referencedColumnName: "reportedCategoryId" },
  ])
  reportedCategory: ReportCategory;

  @ManyToOne(() => Users, (users) => users.reports, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "userId" }])
  user: Users;
}
