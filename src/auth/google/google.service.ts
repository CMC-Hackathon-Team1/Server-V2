import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import axios from 'axios';
import * as qs from 'qs';
import { errResponse, sucResponse } from '../../common/utils/response';
import baseResponse from '../../common/utils/baseResponseStatus';
import { googleConfig } from '../../../config/google.config';

@Injectable()
export class GoogleService {
  clientIdAndroid: string;
  clientIdIos: string;
  clientIdWeb: string;
  clientSecret: string;
  googleRedirectUrl: string;
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
    this.clientIdAndroid = process.env.GOOGLE_ANDROID_CLIENT_ID;
    this.clientIdIos = process.env.GOOGLE_IOS_CLIENT_ID;
    // this.clientIdWeb = process.env.GOOGLE_WEB_CLIENT_SECRET;
    // this.clientSecret = process.env.GOOGLE_WEB_CLIENT_SECRET;
    // this.googleRedirectUrl = process.env.GOOGLE_REDIRECT_URL;
    // this.googleRedirectUrl = process.env.GOOGLE_REDIRECT_LOCAL_URL;
  }

  // 구글의 id token 검증하기
  async getVerifiedGoogleTokenInfo(idToken: any): Promise<any> {
    try {
      const googleVerifyTokenResponse = await axios({
        method: 'GET',
        url: googleConfig.googleTokenInfoUrl + `?id_token=${idToken}`,
        timeout: 30000,
        // headers,
        // data: qs.stringify(body),
      });
      // console.log(googleVerifyTokenResponse);

      return googleVerifyTokenResponse.data;
    } catch (e) {
      // console.log(`googleTokenResponse Error: ${e}`);

      // [Validation 처리]
      // 응답이 잘 안 온 경우 (id token 검증 실패)
      return errResponse(baseResponse.GOOGLE_ID_TOKEN_INVALID);
      // ---
    }
  }

  async googleLogin(idToken: any): Promise<any> {
    // 2. id token 검증을 통해 구글 계정 이메일 가져오기
    const googleTokenInfo = await this.getVerifiedGoogleTokenInfo(idToken);
    const googleVerifiedEmail = googleTokenInfo.email;
    // console.log(googleVerifiedEmail);

    // [NOT NOW, FOR LATER IF NEEDED]
    // 3. 액세스 토큰으로 구글 API 요청하기
    // const googleUserInfo = await this.getGoogleUserInfoByToken(googleAccessToken);
    // const googleUserEmail = googleUserInfo.email;
    // console.log(googleUserEmail);
    // ---

    // 3. 서비스 회원가입 or 로그인 처리
    const socialUserResult = await this.authService.handleSocialUser(googleVerifiedEmail, 'google');
    // console.log(socialUserResult);

    // 4. 회원가입/로그인 결과, 서비스 jwt, 회원ID(?)
    const result = {
      message: socialUserResult.message,
      serviceJwt: socialUserResult.jwt,
      // socialUserId: socialUserResult.userId,
    };

    return result;
  }
}
