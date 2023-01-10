import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './createProfile.dto';

@Injectable()
export class ProfilesService {
  createProfile(createProfileDto: CreateProfileDto) {
    return createProfileDto;
  }
}
