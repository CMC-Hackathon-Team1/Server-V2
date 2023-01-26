import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Notice", { schema: "devDB" })
export class Notice {
  @PrimaryGeneratedColumn({ type: "int", name: "noticeId" })
  noticeId: number;

  @Column("text", { name: "content" })
  content: string;

  @Column("timestamp", {
    name: "createdAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;
}
