import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feeds } from '../common/entities/Feeds';
import { Likes } from '../common/entities/Likes';
import { Profiles } from '../common/entities/Profiles';
import { FeedRepository } from '../feeds/feeds.repository';
import { ProfilesRepository } from '../profiles/profiles.repository';
import { LikesController } from './controller/likes.controller';
import { LikesRepository } from './likes.repository';
import { LikesService } from './service/likes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Likes,Profiles,Feeds])
  ],
  controllers: [LikesController],
  providers: [LikesService,LikesRepository,ProfilesRepository,FeedRepository],
  exports: [LikesRepository,ProfilesRepository,FeedRepository]
})

export class LikesModule {}
