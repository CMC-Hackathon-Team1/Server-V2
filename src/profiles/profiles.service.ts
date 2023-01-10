import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './createProfile.dto';
import { Profile } from './profile.entity';
import { ProfileModel } from './profile.model';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profileTable: Repository<Profile>,
  ) {}
  async createProfile(createProfileDto: CreateProfileDto): Promise<ProfileModel> {
    try {
      const newProfile = this.profileTable.create({
        ...createProfileDto
      });

      return await this.profileTable.save(newProfile);
    } catch (e) {
      return e;
    }
  }
}
