import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Questions } from "./Questions";

@Entity("QuestionContent", { schema: "devDB" })
export class QuestionContent {
  @Column("int", { primary: true, name: "questionId", unsigned: true })
  questionId: number;

  @Column("int", { name: "userId", unsigned: true })
  userId: number;

  @Column("text", { name: "content" })
  content: string;

  @Column("timestamp", { name: "createdAt" })
  createdAt: Date;

  @OneToOne(() => Questions, (questions) => questions.questionContent, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "questionId", referencedColumnName: "questionId" }])
  question: Questions;
}
