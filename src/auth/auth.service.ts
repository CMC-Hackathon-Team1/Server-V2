import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { errResponse, sucResponse } from '../_utilities/response';
import baseResponse from '../_utilities/baseResponseStatus';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/payload.interface';
import { Users } from '../_entities/Users';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as qs from 'qs';
import { kakaoConfig } from '../_config/kakao.config';

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
    return { userId: userFind.userId, accessToken: jwtToken };
  }

  async userValidateToken(payload: Payload): Promise<Users | undefined> {
    // return await this.userService.findByFields({
    //   where: { userId: payload.userId },
    // });
    return await this.userService.getUserInfo(payload.userId);
  }

  async kakaoLogin(code: any): Promise<any> {
    const kakaoKey = process.env.KAKAO_REST_API_KEY;
    const kakaoRedirectUrl = process.env.KAKAO_REDIRECT_URL;
    // const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token';
    // const kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me';

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    const body = {
      grant_type: 'authorization_code',
      client_id: kakaoKey,
      redirect_url: kakaoRedirectUrl,
      code: code,
    };

    // 2. 카카오에게 인가 코드를 보내고 액세스 토큰 받기
    const kakaoTokenResponse = await axios({
      method: 'POST',
      url: kakaoConfig.kakaoTokenUrl,
      timeout: 30000,
      headers,
      data: qs.stringify(body),
    });

    // [Validation 처리]
    // 응답이 잘 안 온 경우 (access token을 못 받은 경우)
    if (kakaoTokenResponse.status !== 200) {
      return errResponse(baseResponse.KAKAO_ACCESS_TOKEN_FAIL);
    }
    // ---

    const kakaoTokenInfo = kakaoTokenResponse.data;
    console.log(kakaoTokenInfo);
    const access_token = kakaoTokenInfo.access_token;

    const headerUserInfo = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: `Bearer ${access_token}`,
    };

    // 3. 액세스 토큰으로 카카오 유저 정보 가져오기
    const kakaoUserInfoResponse = await axios({
      method: 'GET',
      url: kakaoConfig.kakaoUserInfoUrl,
      timeout: 30000,
      headers: headerUserInfo,
    });

    // [Validation 처리]
    // 응답이 잘 안 온 경우
    if (kakaoUserInfoResponse.status !== 200) {
      return errResponse(baseResponse.KAKAO_USER_INFO_FAIL);
    }
    // ---

    const kakaoUserInfo = kakaoUserInfoResponse.data;
    console.log(kakaoUserInfo);
    return kakaoUserInfo;
  }
}
