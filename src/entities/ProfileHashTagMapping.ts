import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { HashTags } from "./HashTags";
import { Profiles } from "./Profiles";

@Index(
  "FK_ProfileHashTagMapping_hashTagId_HashTags_hashTagId",
  ["hashTagId"],
  {}
)
@Entity("ProfileHashTagMapping", { schema: "devDB" })
export class ProfileHashTagMapping {
  @Column("int", { primary: true, name: "profileId", unsigned: true })
  profileId: number;

  @Column("int", { name: "hashTagId", unsigned: true })
  hashTagId: number;

  @Column("timestamp", {
    name: "createdAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(() => HashTags, (hashTags) => hashTags.profileHashTagMappings, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "hashTagId", referencedColumnName: "hashTagId" }])
  hashTag: HashTags;

  @OneToOne(() => Profiles, (profiles) => profiles.profileHashTagMapping, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "profileId", referencedColumnName: "profileId" }])
  profile: Profiles;
}
