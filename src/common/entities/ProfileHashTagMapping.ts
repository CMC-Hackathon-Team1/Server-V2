import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { HashTags } from "./HashTags";
import { Profiles } from "./Profiles";

@Index(
  "FK_ProfileHashTagMapping_hashTagId_HashTags_hashTagId",
  ["hashTagId"],
  {}
)
@Index(
  "FK_ProfileHashTagMapping_profileId_Profiles_profileId",
  ["profileId"],
  {}
)
@Entity("ProfileHashTagMapping", { schema: "devDB" })
export class ProfileHashTagMapping {
  @Column("int", { name: "profileId", unsigned: true })
  profileId: number;

  @Column("int", { name: "hashTagId", unsigned: true })
  hashTagId: number;

  @Column("timestamp", {
    name: "createdAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("int", { primary: true, name: "id", unsigned: true })
  id: number;

  @ManyToOne(() => HashTags, (hashTags) => hashTags.profileHashTagMappings, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "hashTagId", referencedColumnName: "hashTagId" }])
  hashTag: HashTags;

  @ManyToOne(() => Profiles, (profiles) => profiles.profileHashTagMappings, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "profileId", referencedColumnName: "profileId" }])
  profile: Profiles;
}
