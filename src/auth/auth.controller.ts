import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { KakaoService } from './kakao/kakao.service';
import { GoogleService } from './google/google.service';
import { AuthGuard } from '@nestjs/passport';
import { OwnAuthService } from './own/ownAuth.service';
import { AppleService } from './apple/apple.service';

@ApiTags('로그인, 인증 API')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private ownAuthService: OwnAuthService,
    private kakaoService: KakaoService,
    private googleService: GoogleService,
    private appleService: AppleService,
  ) {}

  // API No. 4.1.4.1. 자체로그인 - 회원가입
  @ApiOperation({
    summary: '4.1.4.1. 자체 로그인 - 회원가입',
    description: '이메일,비밀번호로 직접 회원가입한다.',
  })
  @ApiBody({ type: UserDTO })
  @ApiParam({
    name: 'level',
    required: true,
    description: `회원가입 단계\n
    0 : 처음 회원가입 버튼을 누를 때 (이메일 인증을 보낼 떄)
    1 (또는 다른 번호) : 이메일 인증이 완료된 후에 다음 단계로 넘어갈 때`,
  })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: {
      example: sucResponse(baseResponse.SUCCESS, {
        state:
          '인증메일을 확인해주세요. 10분 이내에 답변하지 않으면 회원가입이 취소됩니다.',
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
    status: 1006,
    description: '이메일 인증 메일 보내는 중에 에러.',
    schema: {
      example: errResponse(baseResponse.EMAIL_AUTH_RENDER_FAILED),
    },
  })
  @ApiResponse({
    status: 1007,
    description: '이메일 인증 메일 보내기 실패.',
    schema: {
      example: errResponse(baseResponse.EMAIL_SEND_FAILED),
    },
  })
  @ApiResponse({
    status: 1100,
    description: '해당 이메일로 이미 가입된 회원이 있음.',
    schema: {
      example: errResponse(baseResponse.USER_ALREADY_EXISTS),
    },
  })
  @Post('/signup/:level')
  @UsePipes(ValidationPipe)
  async signUp(@Body() userDTO: UserDTO, @Param('level', ParseIntPipe) level: number): Promise<any> {
    if (level == 0) {
      return await this.ownAuthService.signUp(userDTO);
    } else {
      const checkActivatedUser = await this.userService.checkActiveUser(userDTO.email);
      if (!checkActivatedUser) {
        return errResponse(baseResponse.USER_AUTH_WRONG);
      } else {
        return sucResponse(baseResponse.SUCCESS);
      }
    }
  }

  @ApiOperation({
    summary: '4.1.4.1. 자체 로그인 - 회원가입 - 검증',
    description: '회원가입 API를 통해 이메일에서 인증 버튼을 누르면 자동 호출되는 부분입니다. (직접 테스트 X)',
  })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: { example: '회원가입이 완료되었습니다.' },
  })
  @ApiResponse({
    status: 1008,
    description: '이메일 인증 링크로 이미 인증을 완료됨.',
    schema: { example: '이미 인증이 확인되었습니다.' },
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
    status: 1002,
    description: '인증코드가 잘못됨',
    schema: {
      example: '회원가입에 실패하였습니다. 다시 시도하시거나, 관리자에게 문의 주세요.'
    },
  })
  @ApiResponse({
    status: 1003,
    description: '현재 이메일 인증 중이던 회원에 문제가 발생함',
    schema: {
      example: '회원가입에 실패하였습니다. 다시 시도하시거나, 관리자에게 문의 주세요.'
    },
  })
  @ApiResponse({
    status: 1005,
    description: '이메일 인증 기한이 만료됨. 처음부터 다시 회원가입 하세요.',
    schema: {
      example: '회원가입에 실패하였습니다. 다시 시도하시거나, 관리자에게 문의 주세요.'
    },
  })
  @Post('/signup-callback')
  async validateEmail(
    @Query('email') email: string,
    // @Query('code') authCode: string,
    @Body('code') authCode: string,
    @Res() res: Response,
  ): Promise<any> {
    console.log(email, authCode);
    const activateUserResult = await this.ownAuthService.authenticateAccount(email, authCode);

    if (activateUserResult == baseResponse.SUCCESS) {
      res.send('회원가입이 완료되었습니다.');
    } else if (activateUserResult == baseResponse.USER_AUTH_ALREADY_FINISHED) {
      res.send('이미 인증이 확인되었습니다.');
    } else {
      res.send('회원가입에 실패하였습니다. 다시 시도하시거나, 관리자에게 문의 주세요.');
    }
  }

  // async registerAccount(@Body() userDTO: UserDTO): Promise<any> {
  //   return await this.authService.registerUser(userDTO, 'own');
  // }

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
    schema: {
      example: sucResponse(baseResponse.SUCCESS, { jwt: 'eyJhbGciOiJI...' }),
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
    description:
      '카카오 액세서 토큰을 받아오는데 실패함. (인가 코드가 잘못되었거나 유효하지 않음.)',
    schema: { example: errResponse(baseResponse.KAKAO_ACCESS_TOKEN_FAIL) },
  })
  @ApiResponse({
    status: 1013,
    description: '카카오 인증 토큰을 request에서 넘겨주지 않음',
    schema: { example: errResponse(baseResponse.KAKAO_ACCESS_TOKEN_EMPTY) },
  })
  @ApiResponse({
    status: 1014,
    description:
      '카카오 유저 정보를 불러오는데 실패함. (액세스 토큰이 잘못되었거나 유효하지 않음.)',
    schema: { example: errResponse(baseResponse.KAKAO_USER_INFO_FAIL) },
  })
  @ApiResponse({
    status: 1102,
    description: '다른 로그인 방식으로 가입한 회원임.',
    schema: { example: errResponse(baseResponse.WRONG_LOGIN) },
  })
  @Post('/kakao-login')
  async kakaoLogin(
    @Body('access_token') acces_token: any,
    @Res() res: Response,
  ): Promise<any> {
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
    description:
      '카카오 유저 정보를 불러오는데 실패함. (액세스 토큰이 잘못되었거나 유효하지 않음.)',
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

    const getKakaoUser =
      this.kakaoService.getKakaoUserInfoByToken(kakao_accessToken);

    return getKakaoUser;
  }

  // API No. 4.1.2.1. 구글 로그인 - 회원가입/로그인
  @ApiOperation({
    summary: '4.1.2.1. 구글 로그인 - 회원가입/로그인',
    description: `구글 계정을 통해 로그인/회원가입 한다. (이때, 구글 계정과 연동된 구글 이메일로 가입되도록 한다.) \n
        [Response Body] - response에서 다음 2개 값이 넘어옵니다.\n
        1. state : '회원가입인지, 로그인인지'
        2. jwt= '{서비스 jwt값}'`,
  })
  @ApiBody({
    required: true,
    description: '클라이언트에서 받은 구글 id 토큰',
    schema: { example: { id_token: 'eyJhbGciOiJS...' } },
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
    status: 1020,
    description: '구글 로그인 실패',
    schema: { example: errResponse(baseResponse.GOOGLE_LOGIN_FAILED) },
  })
  @ApiResponse({
    status: 1021,
    description: '구글 인증 토큰을 request에서 넘겨주지 않음',
    schema: { example: errResponse(baseResponse.GOOGLE_ID_TOKEN_EMPTY) },
  })
  @ApiResponse({
    status: 1022,
    description: '구글 인증 토큰 검증에 실패함',
    schema: { example: errResponse(baseResponse.GOOGLE_ID_TOKEN_INVALID) },
  })
  @ApiResponse({
    status: 1102,
    description: '다른 로그인 방식으로 가입한 회원임.',
    schema: { example: errResponse(baseResponse.WRONG_LOGIN) },
  })
  @Post('/google-login')
  async googleLogin(
    @Body('id_token') id_token: any,
    @Res() res: Response,
  ): Promise<any> {
    // 1. 클라이언트로부터 구글 idToken 전달 받기 (request body)
    if (!id_token) {
      return errResponse(baseResponse.GOOGLE_ID_TOKEN_EMPTY);
    }

    const googleResult = await this.googleService.googleLogin(id_token);

    // [Validation 처리]
    // jwt 토큰이 없으면 에러메시지 반환
    if (!googleResult.serviceJwt) {
      return res.send(googleResult);
    }
    // ---

    // 최종. 서비스 로그인 토큰 반환(발급)
    return res.send(
      sucResponse(baseResponse.SUCCESS, {
        state: googleResult.message,
        jwt: googleResult.serviceJwt,
        // userId: googleResult.socialUserId,
      }),
    );
  }

  // [구글 로그인] - for Web
  // @Get('/google')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req: Request): Promise<void> {
  //   // initiate google oauth2 login flow
  //   // redirect google login page
  // }
  //
  // @Get('/google/callback')
  // @UseGuards(AuthGuard('google'))
  // async googleCallback(@Req() req: Request, @Res() res: Response): Promise<any> {
  //   // console.log(req);
  //   const { user } = req;
  //   if (!user) {
  //     return errResponse(baseResponse.GOOGLE_AUTH_USER_FAILED);
  //   } else {
  //     // console.log(user);
  //     const googleUserEmail = user['email'];
  //     const googleAccessToken = user['accessToken'];
  //     // console.log(googleUserEmail, googleAccessToken);
  //
  //     const googleResult = await this.authService.handleSocialUser(
  //       googleUserEmail,
  //       'google',
  //     );
  //     // console.log(googleResult);
  //
  //     // [Validation 처리]
  //     // jwt 토큰이 없으면 에러메시지 반환
  //     if (!googleResult.serviceJwt) {
  //       return res.send(googleResult);
  //     }
  //     // ---
  //
  //     // 구글 accessToken 헤더로 보내기
  //     res.setHeader('Google-Access-Token', googleAccessToken);
  //
  //     return res.send(
  //       sucResponse(baseResponse.SUCCESS, {
  //         state: googleResult.message,
  //         // userId: googleResult.socialUserId,
  //         jwt: googleResult.jwt,
  //       }),
  //     );
  //   }
  // }

  // API No. 4.1.3.1. 애플 로그인 - 회원가입/로그인
  @ApiOperation({
    summary: '4.1.3.1. 애플 로그인 - 회원가입/로그인',
    description: `애플 계정을 통해 로그인/회원가입 한다. (이때, 애플 계정과 연동된 애플 이메일로 가입되도록 한다. 이때, 실제 이메일이 아닌, 애플 고유의 재조합된 이메일로 가입된다.) \n
        [Response Body] - response에서 다음 2개 값이 넘어옵니다.\n
        1. state : '회원가입인지, 로그인인지'
        2. jwt= '{서비스 jwt값}'`,
  })
  @ApiBody({
    required: true,
    description: '클라이언트에서 받은 애플 identity token',
    schema: { example: { identity_token: 'eyJhbGciOiJS...' } },
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
    status: 1030,
    description: '애플 로그인 실패',
    schema: { example: errResponse(baseResponse.APPLE_LOGIN_FAILED) },
  })
  @ApiResponse({
    status: 1031,
    description: '애플 인증 토큰을 request에서 넘겨주지 않음',
    schema: { example: errResponse(baseResponse.APPLE_ID_TOKEN_EMPTY) },
  })
  @ApiResponse({
    status: 1032,
    description: '애플 인증 토큰 검증에 실패함',
    schema: { example: errResponse(baseResponse.APPLE_ID_TOKEN_INVALID) },
  })
  @ApiResponse({
    status: 1102,
    description: '다른 로그인 방식으로 가입한 회원임.',
    schema: { example: errResponse(baseResponse.WRONG_LOGIN) },
  })
  @Post('/apple-login')
  async appleLogin(@Body('identity_token') identity_token: any, @Res() res: Response): Promise<any> {
    // 1. 클라이언트로부터 토큰 전달 받기 (request body)
    if (!identity_token) {
      return errResponse(baseResponse.APPLE_ID_TOKEN_EMPTY);
    }

    const appleResult = await this.appleService.appleLogin(identity_token);

    // [Validation 처리]
    // jwt 토큰이 없으면 에러메시지 반환
    if (!appleResult.serviceJwt) {
      return res.send(appleResult);
    }
    // ---

    // 최종. 서비스 로그인 토큰 반환(발급)
    return res.send(
      sucResponse(baseResponse.SUCCESS, {
        state: appleResult.message,
        jwt: appleResult.serviceJwt,
        // userId: appleResult.socialUserId,
      }),
    );
  }

  // API No. 1.8.6. 로그아웃 (쿠키의 jwt 값 삭제, 유효기간: 0 으로 변경)
  @ApiOperation({
    summary: '1.8.6. 로그아웃',
    description: `헤더에 jwt 정보를 함께 보내 로그아웃 한다. \n
      로그아웃은 로그인 경로에 상관없이, 해당 로그인 타입에 맞게 알아서 로그아웃 처리를 해줍니다.
      로그아웃 성공 이후, 헤더에 보내던 jwt 정보를 클라이언트에서 지워주세요`,
  })
  @ApiBearerAuth('Authorization')
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: {
      example: sucResponse(baseResponse.SUCCESS, {
        TODO: '클라이언트에서 jwt를 지워주세요',
      }),
    },
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
    status: 1002,
    description: '회원 인증이 실패함 (잘못된 jwt)',
    schema: { example: errResponse(baseResponse.USER_AUTH_WRONG) },
  })
  @ApiResponse({
    status: 1104,
    description: '로그아웃 실패 (로그 확인 필요)',
    schema: { example: errResponse(baseResponse.USER_LOGOUT_FAILED) },
  })
  @UseGuards(JWTAuthGuard)
  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<any> {
    // [쿠키를 지우는 방법] - DEPRECATED
    // res.cookie('jwt', '', {
    //   maxAge: 0,
    // });
    // ---

    const user: any = req.user;
    if (!user || !user.userId) {
      return errResponse(baseResponse.USER_AUTH_WRONG);
    }
    const userId = user.userId;
    // console.log(userId);

    const loginTypeInfo = await this.authService.identifyLoginTypeInfo(userId);
    // console.log(loginTypeInfo);
    if (!loginTypeInfo || loginTypeInfo == undefined) {
      return res.send(errResponse(baseResponse.USER_LOGOUT_FAILED));
    }

    // TODO: 소셜 로그인의 경우, 소셜 계정 로그아웃까지 진행
    const logoutType = loginTypeInfo.login_type;
    let logoutResult;
    // 카카오
    // if (logoutType == 'kakao') {
    //   const acces_token = logoutType.access_token;
    //   logoutResult = await this.kakaoService.kakaoLogout(userId, acces_token);
    // }
    // // 구글
    // else if (logoutType == 'google') {
    //   const id_token = logoutType.provider_token;
    //   logoutResult = await this.googleService.googleLogout(userId, id_token);
    // }
    // // 애플
    // else if (logoutType == 'apple') {
    //   const identity_token = logoutType.provider_token;
    //   logoutResult = await this.appleService.appleLogout(userId, identity_token);
    // }
    // console.log(logoutResult);

    // 토큰 정보 초기화
    const resetTokenResult = await this.authService.resetTokens(userId);

    return res.send(
      sucResponse(baseResponse.SUCCESS, {
        TODO: '클라이언트에서 jwt를 지워주세요',
      }),
    );
  }
}
