import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import baseResponse from 'src/config/baseResponseStatus';
import { errResponse, response } from 'src/config/response';
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
      const newProfile = await this.profileTable.save(createProfileDto);

      const result = {
        profileId: newProfile.profileId,
      };

      return response(baseResponse.SUCCESS, result);
    } catch (e) {
      return errResponse(baseResponse.DB_ERROR);
    }
  }
}
