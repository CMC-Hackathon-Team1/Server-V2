import { Injectable } from '@nestjs/common';
import baseResponse from '../_utilities/baseResponseStatus';
import { errResponse, sucResponse } from '../_utilities/response';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  // 회원 탈퇴
  async deleteUser(req: any) {
    try {
      const requestUserId = req.user.userId;

      if (!requestUserId) {
        return errResponse(baseResponse.USER_NOT_FOUND);
      }

      const result = await this.usersRepository.deleteUserByUserId(requestUserId);

      return sucResponse(baseResponse.SUCCESS);
    } catch (error) {
      return errResponse(baseResponse.DB_ERROR);
    }
  }
}
