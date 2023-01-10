import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({synchronize: false, name: 'Profiles'})
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  profileId: number;

  @Column({type: 'int', nullable: false})
  userId: number;

  @Column({type: 'varchar', length: 20, nullable: false})
  profileName: string;

  @Column({type: 'int', nullable: false})
  personaId: number;

  @Column({type: 'text', nullable: false})
  profileImgUrl: string;

  @Column({type: 'varchar', length:100, nullable: false})
  statusMessage: string;

  @CreateDateColumn({type: 'timestamp', nullable: false})
  createdAt: Date;
}