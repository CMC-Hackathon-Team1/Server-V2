import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { QuestionContent } from "./QuestionContent";

@Entity("Questions", { schema: "devDB" })
export class Questions {
  @PrimaryGeneratedColumn({ type: "int", name: "questionId", unsigned: true })
  questionId: number;

  @Column("int", { name: "userId", unsigned: true })
  userId: number;

  @OneToOne(
    () => QuestionContent,
    (questionContent) => questionContent.question
  )
  questionContent: QuestionContent;
}
