import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { errResponse, response } from '../config/response';
import baseResponse from '../config/baseResponseStatus';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async registerUser(newUser: UserDTO): Promise<object> {
    // 이미 있는 계정인지 체크
    const userFind: UserDTO = await this.userService.findByFields({
      where: { email: newUser.email },
    });

    // [Validation 처리]
    // 이미 있는 계정인 경우
    if (userFind) {
      return errResponse(baseResponse.USER_ALREADY_EXISTS);
    }
    // ---

    const addedUser = await this.userService.save(newUser);
    const result = {
      userId: addedUser.userId,
    };

    return response(baseResponse.SUCCESS, result);
  }

  async validateUser(userDTO: UserDTO): Promise<object> {
    const userFind: UserDTO = await this.userService.findByFields({
      where: { email: userDTO.email },
    });

    // [Validation 처리]
    // 로그인 정보를 잘못 입력한 경우
    if (!userFind || userDTO.password !== userFind.password) {
      return errResponse(baseResponse.USER_NOT_FOUND);
    }

    return response(baseResponse.SUCCESS, userFind);
  }
}
