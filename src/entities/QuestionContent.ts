import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Questions } from "./Questions";

@Index("FK_QuestionContent_questionId_Questions_questionId", ["questionId"], {})
@Entity("QuestionContent", { schema: "devDB" })
export class QuestionContent {
  @Column("int", { name: "userId", unsigned: true })
  userId: number;

  @Column("text", { name: "content" })
  content: string;

  @Column("timestamp", { name: "createdAt" })
  createdAt: Date;

  @PrimaryGeneratedColumn({ type: "int", name: "questionId", unsigned: true })
  questionId: number;

  @OneToOne(() => Questions, (questions) => questions.questionContent, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "questionId", referencedColumnName: "questionId" }])
  question: Questions;
}
