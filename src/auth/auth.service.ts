import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { errResponse, sucResponse } from '../_utilities/response';
import baseResponse from '../_utilities/baseResponseStatus';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/payload.interface';
import { Users } from '../_entities/Users';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

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

    return sucResponse(baseResponse.SUCCESS, result);
  }

  async validateUser(userDTO: UserDTO): Promise<any> {
    const userFind: Users = await this.userService.findByFields({
      where: { email: userDTO.email },
    });
    // console.log(userFind);

    // [Validation 처리]
    // 해당 이메일의 계정이 없는 경우
    if (!userFind || userFind == undefined) {
      return errResponse(baseResponse.USER_NOT_FOUND);
    }

    const validatePassword = await bcrypt.compare(userDTO.password, userFind.password);
    // console.log(validatePassword);

    // 비밀번호를 잘못 입력한 경우
    if (!validatePassword) {
      return errResponse(baseResponse.USER_NOT_FOUND);
    }
    // ---

    const payload: Payload = { userId: userFind.userId, email: userFind.email };
    const jwtToken = this.jwtService.sign(payload);
    // console.log(jwtToken);

    // return response(baseResponse.SUCCESS, {
    //   userId: userFind.userId,
    //   accessToken: jwtToken,
    // });
    return { accessToken: jwtToken };
  }

  async userValidateToken(payload: Payload): Promise<Users | undefined> {
    return await this.userService.findByFields({
      where: { userId: payload.userId },
    });
  }
}
