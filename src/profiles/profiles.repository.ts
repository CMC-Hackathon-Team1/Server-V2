import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Profiles } from "../entities/Profiles";
import { CreateProfileDto } from "./createProfile.dto";
import { ProfileModel } from "./profile.model";

@Injectable()
export class ProfilesRepository {
  constructor(
    @InjectRepository(Profiles)
    private profilesTable: Repository<Profiles>
  ) {}

  // 사용자 모든 프로필 리스트 받아오기
  async getUserProfilesList(userId: number): Promise<ProfileModel[]> {
    return await this.profilesTable.find({ where: { userId: userId } });
  }

  // 새 프로필 저장하기
  async saveNewProfile(createProfileDto: CreateProfileDto): Promise<ProfileModel> {
    return await this.profilesTable.save(createProfileDto);
  }
}