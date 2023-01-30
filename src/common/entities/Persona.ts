import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Profiles } from "./Profiles";

@Entity("Persona", { schema: "devDB" })
export class Persona {
  @PrimaryGeneratedColumn({ type: "int", name: "personaId", unsigned: true })
  personaId: number;

  @Column("varchar", { name: "personaName", length: 45 })
  personaName: string;

  @Column("timestamp", {
    name: "createdAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToMany(() => Profiles, (profiles) => profiles.persona)
  profiles: Profiles[];
}
