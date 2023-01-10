import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Questions } from "./Questions";

@Index("FK_QuestionContent_questionId_Questions_questionId", ["questionId"], {})
@Entity("QuestionContent", { schema: "devDB" })
export class QuestionContent {
  @PrimaryGeneratedColumn({type: 'int', name: "questionId", unsigned: true })
  questionId: number;

  @Column("int", { name: "userId", unsigned: true })
  userId: number;

  @Column("text", { name: "content" })
  content: string;

  @Column("timestamp", { name: "createdAt" })
  createdAt: Date;

  @ManyToOne(() => Questions, (questions) => questions.questionContents, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "questionId", referencedColumnName: "questionId" }])
  question: Questions;
}
