import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { errResponse } from "../../_utilities/response";
import baseResponse from "../../_utilities/baseResponseStatus";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: String(process.env.GOOGLE_CLIENT_ID), // 1
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
      // callbackURL: String(process.env.GOOGLE_REDIRECT_URL),
      callbackURL: String(process.env.GOOGLE_REDIRECT_LOCAL_URL),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      // console.log(profile);
      const { displayName, emails } = profile;
      const user = {
        email: emails[0].value,
        // firstName: name.givenName,
        // lastName: name.familyName,
        name: displayName,
        accessToken,
        refreshToken,
      };
      done(null, user);
    } catch (e) {
      console.error(e);
      // TODO: custom Exception 설정으로 분기별 에러 처리하기 (default 는 500)
      return errResponse(baseResponse.GOOGLE_AUTH_USER_FAILED);
      done(e, false);
    }
  }
}
