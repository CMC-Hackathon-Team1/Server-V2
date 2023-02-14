import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from './dto/user.dto';
import { JWTAuthGuard } from './security/auth.guard.jwt';
import { Request, Response } from 'express';
import { errResponse, sucResponse } from '../common/utils/response';
import baseResponse from '../common/utils/baseResponseStatus';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { KakaoService } from './kakao/kakao.service';
import { GoogleService } from './google/google.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('로그인, 인증 API')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private kakaoService: KakaoService,
    private googleService: GoogleService,
  ) {}

  // API No. 4.1.4.1. 자체로그인 - 회원가입
  @ApiOperation({
    summary: '4.1.4.1. 자체 로그인 - 회원가입',
    description: '이메일,비밀번호로 직접 회원가입한다.',
  })
  @ApiBody({ type: UserDTO })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: { example: sucResponse(baseResponse.SUCCESS, { userId: 5 }) },
  })
  @ApiResponse({
    status: 400,
    description: 'Body 오류',
    schema: { example: baseResponse.PIPE_ERROR_EXAMPLE },
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
    schema: { example: errResponse(baseResponse.SERVER_ERROR) },
  })
  @ApiResponse({
    status: 1100,
    description: '해당 이메일로 이미 가입된 회원이 있음.',
    schema: {
      example: errResponse(baseResponse.USER_ALREADY_EXISTS),
    },
  })
  @Post('/signup')
  @UsePipes(ValidationPipe)
  async registerAccount(@Body() userDTO: UserDTO): Promise<any> {
    return await this.authService.registerUser(userDTO, 'own');
  }

  // API No. 4.1.4.2. 자체로그인 - 로그인
  @ApiOperation({
    summary: '4.1.4.2. 자체 로그인 - 로그인',
    description: '이메일,비밀번호로 직접 로그인 한다.',
  })
  @ApiBody({ type: UserDTO })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    headers: {},
    schema: { example: sucResponse(baseResponse.SUCCESS, { jwt: 'eyJhbGciOiJI...' }) },
  })
  @ApiResponse({
    status: 400,
    description: 'Body 오류',
    schema: { example: baseResponse.PIPE_ERROR_EXAMPLE },
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
    schema: { example: errResponse(baseResponse.SERVER_ERROR) },
  })
  @ApiResponse({
    status: 1101,
    description: '로그인 정보 (이메일 or 비밀번호) 를 잘못 입력함.',
    schema: {
      example: errResponse(baseResponse.USER_NOT_FOUND),
    },
  })
  @ApiResponse({
    status: 1102,
    description: '다른 로그인 방식으로 가입한 회원임.',
    schema: { example: errResponse(baseResponse.WRONG_LOGIN) },
  })
  @Post('/login')
  async login(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any> {
    const jwtResult = await this.authService.validateUser(userDTO);
    // console.log(jwtResult);

    // [Validation 처리]
    // jwt 토큰이 없으면 에러메시지 반환
    if (!jwtResult.jwt) {
      return res.send(jwtResult);
    }
    // ---

    // 쿠키 설정 (jwt 담기) - DEPRECATED
    // // res.setHeader('Authorization', 'Bearer ' + jwtResult.accessToken);
    // res.cookie('jwt', jwtResult.accessToken, {
    //   // domain: 'OnAndOff Login',
    //   // httpOnly: true, // 브라우저에서의 쿠키 사용 막기 (XSS등의 보안강화용)
    //   // maxAge: 24 * 60 * 60 * 1000, // 1day
    // });
    // ---

    return res.send(
      sucResponse(baseResponse.SUCCESS, { jwt: jwtResult.jwt }),
      // userId는 굳이 노출시킬 필요 없음
      // sucResponse(baseResponse.SUCCESS, { userId: jwtResult.userId, jwt: jwtResult.jwt }),
    );
  }

  @ApiOperation({
    summary: '※ 자체 로그인 - 유저 정보 확인',
    description: '(사용할 일 없음)',
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JWTAuthGuard)
  @Get('/user-info')
  async isAuthenticated(@Req() req: Request): Promise<any> {
    const user: any = req.user;
    // console.log(user);
    const userId: number = user.userId;
    // console.log(userId);
    // const email: string = user.email;

    const userInfo = await this.userService.getUserInfo(userId);

    return userInfo;
  }

  // 쿠키 가져오기 - DEPRECATED
  // @Get('/cookies')
  // getCookies(@Req() req: Request, @Res() res: Response): any {
  //   const jwt = req.cookies['jwt'];
  //
  //   // [Validation 처리]
  //   // 쿠키가 비어있으면 알려주기
  //   if (!jwt) {
  //     return res.send(errResponse(baseResponse.AUTH_COOKIE_JWT_EMPTY));
  //   }
  //   // ---
  //
  //   return res.send({ jwt: jwt });
  // }
  // ---

  // API No. 4.1.4.3. 자체로그인 - 로그아웃 (쿠키의 jwt 값 삭제, 유효기간: 0 으로 변경)
  @ApiOperation({
    summary: '4.1.4.3. 자체 로그인 - 로그아웃',
    description: `헤더에 jwt 정보를 함께 보내 로그아웃 한다. \n
      로그아웃 성공 이후, 헤더에 보내던 jwt 정보를 클라이언트에서 지워주세요`,
  })
  @ApiBearerAuth('Authorization')
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: { example: sucResponse(baseResponse.SUCCESS, { TODO: '클라이언트에서 jwt를 지워주세요'}) },
  })
  @ApiResponse({
    status: 400,
    description: 'Body 오류',
    schema: { example: baseResponse.PIPE_ERROR_EXAMPLE },
  })
  @ApiResponse({
    status: 401,
    description: 'JWT 오류',
    schema: { example: errResponse(baseResponse.JWT_UNAUTHORIZED) },
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
    schema: { example: errResponse(baseResponse.SERVER_ERROR) },
  })
  @UseGuards(JWTAuthGuard)
  @Post('/logout')
  logout(@Res() res: Response): any {
    // [쿠키를 지우는 방법] - DEPRECATED
    // res.cookie('jwt', '', {
    //   maxAge: 0,
    // });
    // ---

    // TODO: 자체로그인, 소셜로그인 구분하여 소셜로그인의 경우 소셜계정 연결까지 끊기

    return res.send(
      sucResponse(baseResponse.SUCCESS, {
        TODO: '클라이언트에서 jwt를 지워주세요',
      }),
    );
  }

  // API No. 4.1.1.1. 카카오 로그인 - 회원가입/로그인
  @ApiOperation({
    summary: '4.1.1.1. 카카오 로그인 - 회원가입/로그인',
    description: `카카오 계정을 통해 로그인/회원가입 한다. (이때, 카카오 계정과 연동된 이메일로 가입되도록 한다.) \n
        [Response Body] - response에서 다음 2개 값이 넘어옵니다.\n
        1. state : '회원가입인지, 로그인인지'
        2. jwt= '{서비스 jwt값}'`,
  })
  @ApiBody({
    required: true,
    description: '클라이언트에서 받은 카카오 액세스 토큰',
    schema: { example: { access_token: 'ajdskfj...' } },
  })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: {
      example: sucResponse(baseResponse.SUCCESS, {
        state: '로그인 완료 or 회원가입 완료',
        // userId: 555,
        jwt: 'eyJhbGciOiJI...',
      }),
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Body 오류',
    schema: { example: baseResponse.PIPE_ERROR_EXAMPLE },
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
    schema: { example: errResponse(baseResponse.SERVER_ERROR) },
  })
  @ApiResponse({
    status: 1012,
    description: '카카오 액세서 토큰을 받아오는데 실패함. (인가 코드가 잘못되었거나 유효하지 않음.)',
    schema: { example: errResponse(baseResponse.KAKAO_ACCESS_TOKEN_FAIL) },
  })
  @ApiResponse({
    status: 1013,
    description: '카카오 인증 토큰을 request에서 넘겨주지 않음',
    schema: { example: errResponse(baseResponse.KAKAO_ACCESS_TOKEN_EMPTY) },
  })
  @ApiResponse({
    status: 1014,
    description: '카카오 유저 정보를 불러오는데 실패함. (액세스 토큰이 잘못되었거나 유효하지 않음.)',
    schema: { example: errResponse(baseResponse.KAKAO_USER_INFO_FAIL) },
  })
  @ApiResponse({
    status: 1102,
    description: '다른 로그인 방식으로 가입한 회원임.',
    schema: { example: errResponse(baseResponse.WRONG_LOGIN) },
  })
  @Post('/kakao-login')
  async kakaoLogin(@Body('access_token') acces_token: any, @Res() res: Response): Promise<any> {
    // [DEPRECATED] - 프론트엔드에서 처리해줄 사항
    // // 1. 클라이언트로부터 인가 코드 전달 받기 (query string)
    // // const { code } = qs.code;
    // if (!code) {
    //   return errResponse(baseResponse.KAKAO_AUTH_CODE_EMPTY);
    // }
    // ---

    // 1. 클라이언트로부터 카카오 액세스 토큰 전달 받기 (body)
    if (!acces_token) {
      return errResponse(baseResponse.KAKAO_ACCESS_TOKEN_EMPTY);
    }

    const kakaoResult = await this.kakaoService.kakaoLogin(acces_token);

    // [Validation 처리]
    // jwt 토큰이 없으면 에러메시지 반환
    if (!kakaoResult.serviceJwt) {
      return res.send(kakaoResult);
    }
    // ---

    // [DEPRECATED] - 프론트엔드에서 처리할 사항
    // // 카카오 accessToken 헤더로 보내기
    // res.setHeader('Kakao-Access-Token', kakaoResult.kakaoAccessToken);
    //
    // // 쿠키 설정 (jwt 담기) - DEPRECATED
    // // res.cookie('jwt', kakaoResult.serviceJwt, {
    // //   // domain: 'OnAndOff Login',
    // //   httpOnly: true, // 브라우저에서의 쿠키 사용 막기 (XSS등의 보안강화용)
    // //   // maxAge: 24 * 60 * 60 * 1000, // 1day
    // // });
    // // ---
    // ---

    // 최종. 서비스 로그인 토큰 반환(발급)
    return res.send(
      sucResponse(baseResponse.SUCCESS, {
        state: kakaoResult.message,
        // userId: kakaoResult.socialUserId,
        jwt: kakaoResult.serviceJwt,
      }),
    );

    // return kakaoResult;
  }

  @ApiOperation({
    summary: '※ 카카오 로그인 - 카카오 계정 정보 가져오기',
    description: `카카오 로그인을 통해 카카오 계정 정보를 볼 수 있습니다. (추후 이용 여부 결정)`,
  })
  @ApiHeader({
    name: 'kakao-access-token',
    required: true,
    description: `'카카오 액세스 토큰'을 함께 보내야합니다. (서비스 jwt 값 아님!)`,
    example: 'oDb1L9pz6qK3hdOMcop...',
  })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: {
      example: {
        '카카오 계정 정보들': '...',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Body 오류',
    schema: { example: baseResponse.PIPE_ERROR_EXAMPLE },
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
    schema: { example: errResponse(baseResponse.SERVER_ERROR) },
  })
  @ApiResponse({
    status: 1013,
    description: '카카오 액세스 토큰을 request에서 넘겨주지 않음',
    schema: { example: errResponse(baseResponse.KAKAO_ACCESS_TOKEN_EMPTY) },
  })
  @ApiResponse({
    status: 1014,
    description: '카카오 유저 정보를 불러오는데 실패함. (액세스 토큰이 잘못되었거나 유효하지 않음.)',
    schema: { example: errResponse(baseResponse.KAKAO_USER_INFO_FAIL) },
  })
  @Get('/kakao/user')
  async kakaoUserInfo(@Req() req: Request): Promise<any> {
    // 카카오 유저 정보 불러오기
    const kakao_accessToken = req.headers['kakao-access-token'];
    // console.log(kakao_accessToken);
    if (!kakao_accessToken) {
      return errResponse(baseResponse.KAKAO_ACCESS_TOKEN_EMPTY);
    }

    const getKakaoUser = this.kakaoService.getKakaoUserInfoByToken(kakao_accessToken);

    return getKakaoUser;
  }

  // API No. 4.1.1.2. 카카오 로그인 - 로그아웃
  @ApiOperation({
    summary: '4.1.1.2. 카카오 로그인 - 로그아웃',
    description: `카카오 계정을 통해 로그아웃 한다. (추후 테스트와 보완이 필요함) \n
        로그아웃 시, 다음 2가지를 처리합니다.\n
        1. kakao access token 말소 (이후에 카카오 액세스 토큰을 다시 발급 받아야 로그인 가능합니다.)
        2. 서비스 jwt 제거 (헤더에 담아 보내던 서비스 jwt를 클라이언트에서 지우기/초기화 해야 합니다.)`,
  })
  @ApiBearerAuth('Authorization')
  @ApiBody({
    required: true,
    description: '클라이언트에서 받은 카카오 액세스 토큰',
    schema: { example: { access_token: 'ajdskfj...' } },
  })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: { example: sucResponse(baseResponse.SUCCESS, { TODO: '클라이언트에서 jwt를 지워주세요'}) },
  })
  @ApiResponse({
    status: 400,
    description: 'Body 오류',
    schema: { example: baseResponse.PIPE_ERROR_EXAMPLE },
  })
  @ApiResponse({
    status: 401,
    description: 'JWT 오류',
    schema: { example: errResponse(baseResponse.JWT_UNAUTHORIZED) },
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
    schema: { example: errResponse(baseResponse.SERVER_ERROR) },
  })
  @ApiResponse({
    status: 1012,
    description: '카카오 액세서 토큰을 받아오는데 실패함. (인가 코드가 잘못되었거나 유효하지 않음.)',
    schema: { example: errResponse(baseResponse.KAKAO_ACCESS_TOKEN_FAIL) },
  })
  @ApiResponse({
    status: 1013,
    description: '카카오 인증 토큰을 request에서 넘겨주지 않음',
    schema: { example: errResponse(baseResponse.KAKAO_ACCESS_TOKEN_EMPTY) },
  })
  @ApiResponse({
    status: 1014,
    description: '카카오 유저 정보를 불러오는데 실패함. (액세스 토큰이 잘못되었거나 유효하지 않음.)',
    schema: { example: errResponse(baseResponse.KAKAO_USER_INFO_FAIL) },
  })
  @Post('/kakao-logout')
  @UseGuards(JWTAuthGuard)
  async kakaoLogout(@Body('access_token') acces_token: any, @Res() res: Response): Promise<any> {
    if (!acces_token) {
      return res.send(errResponse(baseResponse.KAKAO_ACCESS_TOKEN_EMPTY));
    }

    // 카카오 액세스 토큰으로 카카오 로그아웃 호출하기
    const kakaoResult = await this.kakaoService.kakaoLogout(acces_token);

    // 쿠키 지우기 - DEPRECATED
    // res.cookie('jwt', '', {
    //   maxAge: 0,
    // });
    // ---

    return res.send(kakaoResult);
  }

  // API No. 4.2.1.1. 구글 로그인 - 로그인
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request): Promise<void> {
    // initiate google oauth2 login flow
    // redirect google login page
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response): Promise<any> {
    // console.log(req);
    const { user } = req;
    if (!user) {
      return errResponse(baseResponse.GOOGLE_AUTH_USER_FAILED);
    } else {
      // console.log(user);
      const googleUserEmail = user['email'];
      const googleAccessToken = user['accessToken'];
      // console.log(googleUserEmail, googleAccessToken);

      const googleResult = await this.authService.handleSocialUser(
        googleUserEmail,
        'google',
      );
      // console.log(googleResult);

      // [Validation 처리]
      // jwt 토큰이 없으면 에러메시지 반환
      if (!googleResult.serviceJwt) {
        return res.send(googleResult);
      }
      // ---

      // 구글 accessToken 헤더로 보내기
      res.setHeader('Google-Access-Token', googleAccessToken);

      // 쿠키 설정 (jwt 담기) - DEPRECATED
      // res.cookie('jwt', googleResult.serviceJwt, {
      //   // domain: 'OnAndOff Login',
      //   httpOnly: true, // 브라우저에서의 쿠키 사용 막기 (XSS등의 보안강화용)
      //   // maxAge: 24 * 60 * 60 * 1000, // 1day
      // });
      // ---

      return res.send(
        sucResponse(baseResponse.SUCCESS, {
          state: googleResult.message,
          // userId: googleResult.socialUserId,
          jwt: googleResult.jwt,
        }),
      );
    }
  }

  // [구글 로그인 다른 버전?]
  // @Post('/google-login')
  // async googleLogin(@Query('code') code: any, @Res() res: Response): Promise<any> {
  //   // 1. 클라이언트로부터 인가 코드 전달 받기 (query string)
  //   // const { code } = qs.code;
  //   if (!code) {
  //     return errResponse(baseResponse.KAKAO_AUTH_CODE_EMPTY);
  //   }
  //
  //   const googleResult = await this.googleService.googleLogin(code);
  //
  //   // [Validation 처리]
  //   // jwt 토큰이 없으면 에러메시지 반환
  //   if (!googleResult.serviceJwt) {
  //     return res.send(googleResult);
  //   }
  //   // ---
  //
  //   // 쿠키 설정 (jwt 담기) - DEPRECATED
  //   res.setHeader('Google-Access-Token', googleResult.googleAccessToken);
  //   res.cookie('jwt', googleResult.serviceJwt, {
  //     // domain: 'OnAndOff Login',
  //     httpOnly: true, // 브라우저에서의 쿠키 사용 막기 (XSS등의 보안강화용)
  //     // maxAge: 24 * 60 * 60 * 1000, // 1day
  //   });
  //   // ---
  //
  //   // 최종. 서비스 로그인 토큰 반환(발급)
  //   return res.send(
  //     sucResponse(baseResponse.SUCCESS, {
  //       state: googleResult.message,
  //       userId: googleResult.socialUserId,
  //       // googleAccessToken: googleResult.googleAccessToken,
  //     }),
  //   );
  // }
}
