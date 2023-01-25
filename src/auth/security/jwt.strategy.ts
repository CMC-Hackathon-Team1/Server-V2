import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Payload } from './payload.interface';
import { errResponse, sucResponse } from '../../_utilities/response';
import baseResponse from '../../_utilities/baseResponseStatus';
import { jwtConfig } from '../../_config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: String(process.env.JWT_SECRET),
      // secretOrKey: jwtConfig,
      ignoreExpiration: true,
    });
  }

  async validate(payload: Payload): Promise<any> {
    // console.log('validating');
    const validatedUser = await this.authService.userValidateToken(payload);
    // console.log(validatedUser);

    if (!validatedUser) {
      // FIXME: 자체적으로 에러 메시지를 처리할 수 있게 바꾸면 좋을듯. 왠지 모르겠지만 이건 안된다. (default는 401 상태코드로 고정)
      return errResponse(baseResponse.USER_NOT_FOUND);
      // throw new UnauthorizedException();
    }

    // return done(null, validatedUser);
    // return sucResponse(baseResponse.SUCCESS, validatedUser);
    return validatedUser;
  }
}
