import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import axios from 'axios';
import * as qs from 'qs';
import { errResponse, sucResponse } from '../../_utilities/response';
import baseResponse from '../../_utilities/baseResponseStatus';
import { googleConfig } from '../../_config/google.config';

@Injectable()
export class GoogleService {
  clientId: string;
  clientSecret: string;
  googleRedirectUrl: string;
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
    this.clientId = process.env.GOOGLE_CLIENT_ID;
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    // this.googleRedirectUrl = process.env.GOOGLE_REDIRECT_URL;
    this.googleRedirectUrl = process.env.GOOGLE_REDIRECT_LOCAL_URL;
  }

  async googleLogin(code: any): Promise<any> {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    const body = {
      code: code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_url: this.googleRedirectUrl,
      grant_type: 'authorization_code',
    };

    let googleAccessToken;
    // 2. 구글에게 인가 코드를 보내고 액세스 토큰 받기
    try {
      const googleTokenResponse = await axios({
        method: 'POST',
        url: googleConfig.googleAccessTokenUrl,
        timeout: 30000,
        headers,
        data: qs.stringify(body),
      });
      console.log(googleTokenResponse);

      const googleTokenInfo = googleTokenResponse.data;
      // console.log(googleTokenInfo);
      googleAccessToken = googleTokenInfo.access_token;
      // console.log(`googleAccessToken: ${googleAccessToken}`);

      // (로컬에서) 로그아웃을 위해 구글 액세스 토큰 저장해두기
      // this.setToken(googleTokenInfo.access_token);
    } catch (e) {
      // console.log(`googleTokenResponse Error: ${e}`);

      // [Validation 처리]
      // 응답이 잘 안 온 경우 (access token을 못 받은 경우)
      return errResponse(baseResponse.KAKAO_ACCESS_TOKEN_FAIL);
      // ---
    }

    // if (kakaoTokenResponse.status !== 200) {
    if (googleAccessToken === '' || googleAccessToken === undefined) {
      return errResponse(baseResponse.KAKAO_ACCESS_TOKEN_FAIL);
    }

    // 3. 액세스 토큰으로 구글 API 요청하기
    // const kakaoUserInfo = await this.getKakaoUserInfoByToken(kakaoAccessToken);
    // const kakaoUserEmail = kakaoUserInfo.kakao_account.email;
    // console.log(kakaoUserEmail);

    // // 4. 서비스 회원가입 or 로그인 처리
    // const socialUserResult = await this.authService.handleSocialUser(kakaoUserEmail);
    // // console.log(socialUserResult);
    //
    // // 5. 카카오 access token, 회원가입/로그인 한 userId, 서비스 jwt, 이메일(?) 반환
    // const result = {
    //   message: socialUserResult.message,
    //   kakaoAccessToken: kakaoAccessToken,
    //   serviceJwt: socialUserResult.jwt,
    //   socialUserId: socialUserResult.userId,
  }

  // return result;

  // async kakaoLogout(accessToken: any): Promise<any> {
  //   // console.log(`LOGOUT TOKEN : ${accessToken}`);
  //
  //   const headerUserInfo = {
  //     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  //     Authorization: `Bearer ${accessToken}`,
  //   };
  //
  //   // 방법1. 토큰 만료 (logout) - 로그아웃
  //   try {
  //     const kakaoLogoutResponse = await axios({
  //       method: 'POST',
  //       url: kakaoConfig.kakaoLogoutUrl,
  //       timeout: 30000,
  //       headers: headerUserInfo,
  //     });
  //
  //     // console.log(kakaoLogoutResponse);
  //
  //     // (로컬에서) 저장해둔 토큰 해제하기
  //     // this.setToken('');
  //
  //     return sucResponse(baseResponse.SUCCESS);
  //   } catch (e) {
  //     console.log(`kakaoLogoutResponse Error: ${e}`);
  //     return errResponse(baseResponse.KAKAO_LOGOUT_FAILED);
  //   }
  //
  //   // 방법2. 연결 끊기 (unlink) - 탈퇴 or 다른 카카오 아이디로 로그인
  //   // try {
  //   //   const kakaoUnlinkResponse = await axios({
  //   //     method: 'POST',
  //   //     url: kakaoConfig.kakaoUnlinkUrl,
  //   //     timeout: 30000,
  //   //     headers: headerUserInfo,
  //   //   });
  //   // } catch (e) {
  //   //   console.log(`kakaoUnlinkResponse Error: ${e}`);
  //   // }
  // }
}
