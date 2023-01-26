import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from '../common/entities/Likes';
import { LikesController } from './likes.controller';
import { LikesRepository } from './likes.repository';
import { LikesService } from './likes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Likes])
  ],
  controllers: [LikesController],
  providers: [LikesService,LikesRepository],
  exports: [LikesRepository]
})

export class LikesModule {}
