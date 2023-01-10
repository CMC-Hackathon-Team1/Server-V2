import { Body, Controller, Post } from '@nestjs/common';
import { CreateProfileDto } from './createProfile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Post()
  createProfile(
    @Body() createProfileDto: CreateProfileDto
  ) {
    return this.profilesService.createProfile(createProfileDto);
  }
}
