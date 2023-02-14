import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import axios from 'axios';
import { kakaoConfig } from '../../../config/kakao.config';
import * as qs from 'qs';
import { errResponse, sucResponse } from '../../common/utils/response';
import baseResponse from '../../common/utils/baseResponseStatus';

@Injectable()
export class KakaoService {
  check: boolean;
  // kakaoAccessToken: string;
  kakaoApiKey: string;
  kakaoRedirectUrl: string;

  constructor(
    private authService: AuthService,
  ) {
    this.check = false;
    // this.kakaoAccessToken = '';
    this.kakaoApiKey = process.env.KAKAO_REST_API_KEY;
    this.kakaoRedirectUrl = process.env.KAKAO_REDIRECT_URL;
  }

  loginCheck(): void {
    this.check = !this.check;
    return;
  }

  // (로컬에서) 카카오 액세스 토큰을 잠시 저장해두기 위해 만든 함수
  // setToken(token: string): boolean {
  //   this.kakaoAccessToken = token;
  //   return true;
  // }

  // 카카오의 access token으로 카카오 유저 정보 불러오기
  async getKakaoUserInfoByToken(accessToken: any): Promise<any> {
    const headerUserInfo = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const kakaoUserInfoResponse = await axios({
        method: 'GET',
        url: kakaoConfig.kakaoUserInfoUrl,
        // timeout: 30000,
        headers: headerUserInfo,
      });

      const kakaoUserInfo = kakaoUserInfoResponse.data;
      // console.log(kakaoUserInfo);

      return kakaoUserInfo;
    } catch (e) {
      console.log(`kakaoUserInfoResponse Error : ${e}`);

      // [Validation 처리]
      // 응답이 잘 안 온 경우
      return errResponse(baseResponse.KAKAO_USER_INFO_FAIL);
      // ---
    }
  }

  async kakaoLogin(accessToken: any): Promise<any> {
    // [DEPRECATED] - 프론트엔드에서 처리해줄 사항
    // const headers = {
    //   'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    // };
    // const body = {
    //   grant_type: 'authorization_code',
    //   client_id: this.kakaoApiKey,
    //   redirect_url: this.kakaoRedirectUrl,
    //   code: code,
    // };
    //
    // let kakaoAccessToken;
    // // 2. 카카오에게 인가 코드를 보내고 액세스 토큰 받기
    // try {
    //   const kakaoTokenResponse = await axios({
    //     method: 'POST',
    //     url: kakaoConfig.kakaoTokenUrl,
    //     timeout: 30000,
    //     headers,
    //     data: qs.stringify(body),
    //   });
    //
    //   const kakaoTokenInfo = kakaoTokenResponse.data;
    //   // console.log(kakaoTokenInfo);
    //   kakaoAccessToken = kakaoTokenInfo.access_token;
    //   // console.log(`kakaoAccessToken: ${kakaoAccessToken}`);
    //
    //   // (로컬에서) 로그아웃을 위해 카카오 액세스 토큰 저장해두기
    //   // this.setToken(kakaoTokenInfo.access_token);
    // } catch (e) {
    //   // console.log(`kakaoTokenResponse Error: ${e}`);
    //
    //   // [Validation 처리]
    //   // 응답이 잘 안 온 경우 (access token을 못 받은 경우)
    //   return errResponse(baseResponse.KAKAO_ACCESS_TOKEN_FAIL);
    //   // ---
    // }
    //
    // // if (kakaoTokenResponse.status !== 200) {
    // if (kakaoAccessToken === '' || kakaoAccessToken === undefined) {
    //   return errResponse(baseResponse.KAKAO_ACCESS_TOKEN_FAIL);
    // }
    // ---

    // 3. 액세스 토큰으로 카카오 유저 정보 가져오기
    const kakaoUserInfo = await this.getKakaoUserInfoByToken(accessToken);
    const kakaoUserEmail = kakaoUserInfo.kakao_account.email;
    // console.log(kakaoUserEmail);

    // 4. 서비스 회원가입 or 로그인 처리
    const socialUserResult = await this.authService.handleSocialUser(kakaoUserEmail, 'kakao');
    // console.log(socialUserResult);

    // 5. 카카오 access token, 회원가입/로그인 한 userId, 서비스 jwt, 이메일(?) 반환
    const result = {
      message: socialUserResult.message,
      serviceJwt: socialUserResult.jwt,
      // socialUserId: socialUserResult.userId,
    };

    return result;
  }

  async kakaoLogout(accessToken: any): Promise<any> {
    // console.log(`LOGOUT TOKEN : ${accessToken}`);

    const headerUserInfo = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
    };

    // 방법1. 토큰 만료 (logout) - 로그아웃
    try {
      const kakaoLogoutResponse = await axios({
        method: 'POST',
        url: kakaoConfig.kakaoLogoutUrl,
        timeout: 30000,
        headers: headerUserInfo,
      });

      // console.log(kakaoLogoutResponse);

      // (로컬에서) 저장해둔 토큰 해제하기
      // this.setToken('');

      return sucResponse(baseResponse.SUCCESS, {
        TODO: '클라이언트에서 jwt를 지워주세요',
      });
    } catch (e) {
      console.log(`kakaoLogoutResponse Error: ${e}`);
      return errResponse(baseResponse.KAKAO_LOGOUT_FAILED);
    }

    // 방법2. 연결 끊기 (unlink) - 탈퇴 or 다른 카카오 아이디로 로그인
    // try {
    //   const kakaoUnlinkResponse = await axios({
    //     method: 'POST',
    //     url: kakaoConfig.kakaoUnlinkUrl,
    //     timeout: 30000,
    //     headers: headerUserInfo,
    //   });
    // } catch (e) {
    //   console.log(`kakaoUnlinkResponse Error: ${e}`);
    // }
  }
}
