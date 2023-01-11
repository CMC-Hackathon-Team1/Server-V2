import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FeedHashTagMapping } from "./FeedHashTagMapping";
import { ProfileHashTagMapping } from "./ProfileHashTagMapping";

@Entity("HashTags", { schema: "devDB" })
export class HashTags {
  @PrimaryGeneratedColumn({ type: "int", name: "hashTagId", unsigned: true })
  hashTagId: number;

  @Column("varchar", { name: "hashTagName", length: 45 })
  hashTagName: string;

  @OneToMany(
    () => FeedHashTagMapping,
    (feedHashTagMapping) => feedHashTagMapping.hashTag
  )
  feedHashTagMappings: FeedHashTagMapping[];

  @OneToMany(
    () => ProfileHashTagMapping,
    (profileHashTagMapping) => profileHashTagMapping.hashTag
  )
  profileHashTagMappings: ProfileHashTagMapping[];
}
