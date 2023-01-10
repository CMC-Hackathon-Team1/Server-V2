import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateProfileDto } from './createProfile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createProfile(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.createProfile(createProfileDto);
  }
}
