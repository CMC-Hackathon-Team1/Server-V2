import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileBlock } from '../common/entities/ProfileBlock';
import { Profiles } from '../common/entities/Profiles';
import { ProfilesRepository } from '../profiles/profiles.repository';
import { ProfileBlockController } from './profile-block.controller';
import { ProfileBlockRepository } from './profile-block.repository';
import { ProfileBlockService } from './profile-block.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfileBlock,Profiles])
  ],
  controllers: [ProfileBlockController],
  providers: [ProfileBlockService,ProfilesRepository,ProfileBlockRepository],
  exports: [ProfilesRepository, ProfileBlockRepository]
})
export class ProfileBlockModule {}
