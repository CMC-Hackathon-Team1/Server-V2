import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Index("from_user_id", ["fromUserId"], {})
@Index("to_user_id", ["toUserId"], {})
@Entity("UserBlock", { schema: "OnNOff" })
export class UserBlock {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "from_user_id", unsigned: true })
  fromUserId: number;

  @Column("int", { name: "to_user_id", unsigned: true })
  toUserId: number;

  @ManyToOne(() => Users, (users) => users.userBlocks, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "from_user_id", referencedColumnName: "userId" }])
  fromUser: Users;

  @ManyToOne(() => Users, (users) => users.userBlocks2, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "to_user_id", referencedColumnName: "userId" }])
  toUser: Users;
}
