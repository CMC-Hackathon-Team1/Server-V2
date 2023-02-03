import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from '../common/entities/Categories';
import { CategoryRepository } from './categories.repository';
import { CategoriesController } from './controller/categories.controller';
import { CategoriesService } from './service/categories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Categories])
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService,CategoryRepository],
  exports:[CategoryRepository]
})
export class CategoriesModule {}
