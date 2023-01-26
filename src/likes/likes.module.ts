import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from '../common/entities/Likes';
import { LikesController } from './controller/likes.controller';
import { LikesRepository } from './likes.repository';
import { LikesService } from './service/likes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Likes])
  ],
  controllers: [LikesController],
  providers: [LikesService,LikesRepository],
  exports: [LikesRepository]
})

export class LikesModule {}
