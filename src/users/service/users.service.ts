import { Injectable } from '@nestjs/common';
import baseResponse from '../../common/utils/baseResponseStatus';
import { errResponse, sucResponse } from '../../common/utils/response';
import { ChangeUserStatusDto } from '../dto/changeUserStatus.dto';
import { UserStatus } from '../enum/userStatus.enum';
import { UsersRepository } from '../users.repository';

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

      const result = await this.usersRepository.deleteUserByUserId(
        requestUserId,
      );

      return sucResponse(baseResponse.SUCCESS);
    } catch (error) {
      return errResponse(baseResponse.DB_ERROR);
    }
  }

  // 계정 공개상태 변경
  async changeUserStatus(changeUserStatusDto: ChangeUserStatusDto, req: any) {
    try {
      const requestUserId = req.user.userId;
      const userStatus = changeUserStatusDto.userStatus;

      if (!requestUserId) {
        return errResponse(baseResponse.USER_NOT_FOUND);
      }

      if (userStatus !== UserStatus.ACTIVE && userStatus !== UserStatus.HIDDEN) {
        return errResponse(baseResponse.USER_STATUS_ERROR);
      }

      await this.usersRepository.changeUserStatus(userStatus, requestUserId);

      return sucResponse(baseResponse.SUCCESS);
    } catch (error) {
      console.log(error);
      return errResponse(baseResponse.DB_ERROR);
    }
  }

  async getUserEmailInfo(req: any) {
    const userId = req.user.userId;
    if (!userId) {
      return errResponse(baseResponse.USER_NOT_FOUND);
    }

    const userEmailResult = await this.usersRepository.getUserEmailById(userId);

    if (!userEmailResult) {
      return errResponse(baseResponse.USER_NOT_FOUND);
    }

    return sucResponse(baseResponse.SUCCESS, userEmailResult);
  }
}
