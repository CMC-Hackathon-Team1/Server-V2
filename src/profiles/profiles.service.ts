import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './createProfile.dto';
import { Profile } from './profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profileTable: Repository<Profile>,
  ) {}

  async createProfile(createProfileDto: CreateProfileDto): Promise<object> {
    try {
      const newProfile = this.profileTable.create({
        ...createProfileDto
      });

      const result = await this.profileTable.save(newProfile);

      return {'isSuccess': true, 'code': 100, 'message': 'SUCCESS', 'result': {'profileId': result.profileId}};
    }
    catch (e) {
      return e;
    }
  }
}
