import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import axios from 'axios';
import * as qs from 'qs';
import { errResponse, sucResponse } from '../../common/utils/response';
import baseResponse from '../../common/utils/baseResponseStatus';

import verifyAppleToken from 'verify-apple-id-token';

@Injectable()
export class AppleService {
  clientIdIOS: string;
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
    this.clientIdIOS = process.env.APPLE_CLIENT_ID;
  }

  // 애플의 identity token 검증하기
  async getVerifiedAppleTokenInfo(identityToken: any): Promise<any> {
    // 1. Verify the JWS E256 signature using the server’s public key
    // 2. Verify the nonce for the authentication
    // 3. Verify that the iss field contains https://appleid.apple.com
    // 4. Verify that the aud field is the developer’s client_id
    // 5. Verify that the time is earlier than the exp value of the token

    // 위 5가지 단계를 해주는 패키지 설치 (npm i verify-apple-id-token)
    try {
      console.log(identityToken);
      console.log(this.clientIdIOS);
      const appleVerifyTokenResponse = await verifyAppleToken({
        idToken: identityToken,
        clientId: this.clientIdIOS,
        // nounce: ,
      });
      console.log("verify apple token");
      console.log(appleVerifyTokenResponse);

      return appleVerifyTokenResponse;
    } catch (e) {
      console.log(`appleTokenResponse Error: ${e}`);

      return false;
      // ---
    }
  }

  async appleLogin(identityToken: any): Promise<any> {
    // 2. identity token 검증을 통해 구글 계정 이메일 가져오기
    const appleTokenInfo = await this.getVerifiedAppleTokenInfo(identityToken);
    // [Validation 처리]
    // 응답이 잘 안 온 경우 (identity token 검증 실패)
    if (!appleTokenInfo) {
      return errResponse(baseResponse.APPLE_ID_TOKEN_INVALID);
    }
    // ---
    const appleVerifiedEmail = appleTokenInfo.email;
    // console.log(appleVerifiedEmail);

    // [NOT NOW, FOR LATER IF NEEDED]
    // 3. 액세스 토큰으로 애플 API 요청하기
    // const appleUserInfo = await this.getAppleUserInfoByToken(appleAccessToken);
    // const appleUserEmail = appleUserInfo.email;
    // console.log(appleUserEmail);
    // ---

    const appleUserParams = { accessToken: null, idToken: identityToken };
    // 3. 서비스 회원가입 or 로그인 처리
    const socialUserResult = await this.authService.handleSocialUser(appleVerifiedEmail, 'apple', appleUserParams);
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
