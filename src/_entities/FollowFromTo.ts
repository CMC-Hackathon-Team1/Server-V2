import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Profiles } from "./Profiles";

@Index("FK_FollowFromTo_fromUserId_Profiles_profileId", ["fromUserId"], {})
@Index("FK_FollowFromTo_toUserId_Profiles_profileId", ["toUserId"], {})
@Entity("FollowFromTo", { schema: "devDB" })
export class FollowFromTo {
  @Column("int", { name: "fromUserId", unsigned: true })
  fromUserId: number;

  @Column("int", { name: "toUserId", unsigned: true })
  toUserId: number;

  @Column("int", { primary: true, name: "id", unsigned: true })
  id: number;

  @ManyToOne(() => Profiles, (profiles) => profiles.followFromTos, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "fromUserId", referencedColumnName: "profileId" }])
  fromUser: Profiles;

  @ManyToOne(() => Profiles, (profiles) => profiles.followFromTos2, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "toUserId", referencedColumnName: "profileId" }])
  toUser: Profiles;
  
  constructor(fromUserId: number, toUserId: number) {
    this.fromUserId=fromUserId;
    this.toUserId=toUserId;
  }
}
