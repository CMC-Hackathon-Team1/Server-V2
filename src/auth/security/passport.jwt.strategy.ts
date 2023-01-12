import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Payload } from './payload.interface';
import { errResponse, response } from '../../config/response';
import baseResponse from '../../config/baseResponseStatus';
import { jwtConstants } from '../secret/jwt.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secretOrKey: String(process.env.JWT_SECRET),
      secretOrKey: jwtConstants.secret,
      ignoreExpiration: true,
    });
  }

  async validate(payload: Payload): Promise<any> {
    // console.log('validating');
    const validatedUser = await this.authService.userValidateToken(payload);
    // console.log(validatedUser);

    if (!validatedUser) {
      return errResponse(baseResponse.USER_NOT_FOUND);
      // throw new UnauthorizedException();
    }

    // return done(null, validatedUser);
    return response(baseResponse.SUCCESS, validatedUser);
    // return validatedUser;
  }
}
