import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JWTAuthGuard } from '../auth/security/auth.guard.jwt';
import { CreateProfileDto } from './createProfile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  // API No. 1.1 프로필 생성
  @UseGuards(JWTAuthGuard)
  @Post('/create')
  @UsePipes(ValidationPipe)
  createProfile(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.createProfile(createProfileDto);
  }
}
