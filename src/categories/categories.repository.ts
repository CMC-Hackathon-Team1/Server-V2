import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories } from '../common/entities/Categories';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Categories)
    private categoryTable: Repository<Categories>,
  ) {}

  async getAll() {
    return await this.categoryTable.createQueryBuilder("categories").getMany();
  }
}
