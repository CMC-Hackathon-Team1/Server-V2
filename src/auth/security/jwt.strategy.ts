import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Payload } from './jwt.payload.interface';
import { errResponse, sucResponse } from '../../common/utils/response';
import baseResponse from '../../common/utils/baseResponseStatus';
import { jwtConfig } from '../../../config/jwt.config';

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
      // // TODO: custom Exception 설정으로 분기별 에러 처리하기 (default는 401 상태코드로 고정)
      return errResponse(baseResponse.USER_NOT_FOUND);
      // throw new UnauthorizedException();
    }

    // return done(null, validatedUser);
    // return sucResponse(baseResponse.SUCCESS, validatedUser);
    return validatedUser;
  }
}
