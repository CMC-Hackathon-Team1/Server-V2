import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profiles } from "./Profiles";

@Index("FK_FollowFromTo_fromUserId_Profiles_profileId", ["fromUserId"], {})
@Index("FK_FollowFromTo_toUserId_Profiles_profileId", ["toUserId"], {})
@Entity("FollowFromTo", { schema: "devDB" })
export class FollowFromTo {
  @Column("int", { name: "fromUserId", unsigned: true })
  fromUserId: number;

  @Column("int", { name: "toUserId", unsigned: true })
  toUserId: number;

  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @ManyToOne(() => Profiles, (profiles) => profiles.followFromTos, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "fromUserId", referencedColumnName: "profileId" }])
  fromUser: Profiles;

  @ManyToOne(() => Profiles, (profiles) => profiles.followFromTos2, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "toUserId", referencedColumnName: "profileId" }])
  toUser: Profiles;
  
  constructor(fromUserId: number, toUserId: number) {
    this.fromUserId=fromUserId;
    this.toUserId=toUserId;
  }
}
