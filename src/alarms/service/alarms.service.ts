import { Injectable } from '@nestjs/common';
import { ProfilesRepository } from '../../profiles/profiles.repository';

@Injectable()
export class AlarmsService {
  constructor(private profilesRepository: ProfilesRepository) {}

  test() {
    return null;
  }
}
