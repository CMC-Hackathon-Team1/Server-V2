import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { errResponse, sucResponse } from '../common/utils/response';
import baseResponse from '../common/utils/baseResponseStatus';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/jwt.payload.interface';
import { Users } from '../common/entities/Users';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async registerUser(newUser: UserDTO, loginType: string): Promise<object> {
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

    const addedUser = await this.userService.save(newUser, loginType, null);
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

    // 다른 플랫폼으로 가입한 계정인 경우
    if (userFind.login_type != null) {
      return errResponse(baseResponse.WRONG_LOGIN);
    }

    const validatePassword = await bcrypt.compare(userDTO.password, userFind.password);
    // console.log(validatePassword);

    // 비밀번호를 잘못 입력한 경우
    if (!validatePassword) {
      return errResponse(baseResponse.USER_NOT_FOUND);
    }
    // ---

    const payload: Payload = { userId: userFind.userId, email: userFind.email };
    const jwt = this.jwtService.sign(payload);
    // console.log(jwtToken);

    // return response(baseResponse.SUCCESS, {
    //   userId: userFind.userId,
    //   accessToken: jwtToken,
    // });
    return { userId: userFind.userId, jwt: jwt };
  }

  async userValidateToken(payload: Payload): Promise<Users | undefined> {
    // return await this.userService.findByFields({
    //   where: { userId: payload.userId },
    // });
    return await this.userService.getUserInfo(payload.userId);
  }

  async handleSocialUser(email: string, loginType: string, socialParams: any): Promise<any> {
    const checkUser = await this.userService.findByEmail(email);
    // console.log(checkUser);

    let socialUserId: number;
    let message: string;

    if (!checkUser || checkUser === undefined) {
      // 회원가입하기
      const newUser: UserDTO = { email: email, password: null };
      const addedUser = await this.userService.save(newUser, loginType, socialParams);
      console.log(`추가된 회원 id: ${addedUser.userId}`);

      socialUserId = addedUser.userId;
      message = '회원가입 완료';
    } else {
      // [Validation 처리]
      // 다른 플랫폼으로 가입한 계정인 경우
      if (checkUser.login_type != loginType) {
        return errResponse(baseResponse.WRONG_LOGIN);
      }
      // ---

      // 로그인하기
      socialUserId = checkUser.userId;

      const updateUserResult = await this.userService.updateSocialParams(socialUserId, socialParams);
      // console.log(updateUserResult);

      message = '로그인 완료';
    }

    const payload: Payload = { userId: socialUserId, email: email };
    const jwtToken = this.jwtService.sign(payload);

    return { userId: socialUserId, jwt: jwtToken, message: message };
  }

  async resetTokens(userId: number): Promise<any> {
    return await this.userService.deleteTokens(userId);
  }
}
