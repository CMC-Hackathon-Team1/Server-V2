import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { errResponse } from '../utils/response';
import baseResponse from '../utils/baseResponseStatus';

// TODO: jwt 미들웨어를 자체적으로 처리할 거면 사용해도 되지만,현재 authguard 로 사용 중이므로 불필요. 추후 사용 여부 결정.
@Injectable()
export class JwtMiddleware implements NestMiddleware {
  // constructor(
  //
  // ) {}
  use(req: Request, res: Response, next: NextFunction): any {
    // console.log('Request...');
    const token = req.cookies['jwt'];

    // [Validation 처리]
    // 쿠키에 jwt가 없으면 (=로그인 상태 X)
    if (!token) {
      return res.send(errResponse(baseResponse.AUTH_COOKIE_JWT_EMPTY));
    }

    const onError = (error) => {
      return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    };

    try {
      // jwt 검증하기

    } catch (onError) {}

    next();
  }
}
