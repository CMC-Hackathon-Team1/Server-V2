import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profiles } from "./Profiles";

@Index("FK_FollowFromTo_fiomUserId_Profiles_profileId", ["fiomUserId"], {})
@Index("FK_FollowFromTo_toUserId_Profiles_profileId", ["toUserId"], {})
@Entity("FollowFromTo", { schema: "devDB" })
export class FollowFromTo {
  @PrimaryGeneratedColumn({type: "int",  name: "fiomUserId", unsigned: true })
  fiomUserId: number;

  @Column("int", { name: "toUserId", unsigned: true })
  toUserId: number;

  @ManyToOne(() => Profiles, (profiles) => profiles.followFromTos, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "fiomUserId", referencedColumnName: "profileId" }])
  fiomUser: Profiles;

  @ManyToOne(() => Profiles, (profiles) => profiles.followFromTos2, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "toUserId", referencedColumnName: "profileId" }])
  toUser: Profiles;
}
