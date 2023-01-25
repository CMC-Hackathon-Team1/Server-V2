import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: String(process.env.GOOGLE_CLIENT_ID), // 1
      clientSecret: String(process.env.GOOGLE_REST_API_KEY),
      callbackURL: String(process.env.GOOGLE_REDIRECT_URL),
      scope: ['email', 'profile'],
    });
  }

  // TODO
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      // firstName: name.givenName,
      // lastName: name.familyName,
      name: name,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
