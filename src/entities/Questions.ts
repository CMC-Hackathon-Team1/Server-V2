import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { QuestionContent } from "./QuestionContent";

@Entity("Questions", { schema: "devDB" })
export class Questions {
  @PrimaryGeneratedColumn({ type: "int", name: "questionId", unsigned: true })
  questionId: number;

  @Column("int", { name: "userId", unsigned: true })
  userId: number;

  @OneToMany(
    () => QuestionContent,
    (questionContent) => questionContent.question
  )
  questionContents: QuestionContent[];
}
