import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Profiles } from './Profiles';

@Index("from_profile_id", ["fromProfileId"], {})
@Index("to_profile_id", ["toProfileId"], {})
@Entity("ProfileBlock", { schema: "OnNOff" })
export class ProfileBlock {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "from_profile_id", unsigned: true })
  fromProfileId: number;

  @Column("int", { name: "to_profile_id", unsigned: true })
  toProfileId: number;

  @ManyToOne(() => Profiles, (profile) => profile.fromProfileBlocked, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "from_profile_id", referencedColumnName: "profileId" }])
  fromProfile: Profiles;

  @ManyToOne(() => Profiles, (profile) => profile.toProfileBlocked, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "to_profile_id", referencedColumnName: "profileId" }])
  toProfile: Profiles;

  constructor(fromProfileId: number, toProfileId: number) {
    this.fromProfileId=fromProfileId;
    this.toProfileId=toProfileId;
  }
}
