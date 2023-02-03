import { Injectable } from '@nestjs/common';
import baseResponse from '../../common/utils/baseResponseStatus';
import { errResponse, sucResponse } from '../../common/utils/response';
import { CategoryRepository } from '../categories.repository';

@Injectable()
export class CategoriesService {
    constructor(
        private categoryRepository: CategoryRepository,
      ) {}
    async GetCategories() {
        let categoryList;
        try{
            categoryList=await this.categoryRepository.getAll();
        }catch(err){
            console.log(err);
            return errResponse(baseResponse.DB_ERROR);
        }
        return sucResponse(baseResponse.SUCCESS,categoryList);
    }
}
