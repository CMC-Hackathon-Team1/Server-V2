import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './createProfile.dto';
import { Profile } from './profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profile: Repository<Profile>,
  ) {}
  async createProfile(createProfileDto: CreateProfileDto) {
    try {
      const newProfile = this.profile.create({
        ...createProfileDto
      });

      await this.profile.save(newProfile);

      return newProfile;
    } catch (e) {
      return e;
    }
  }
}
