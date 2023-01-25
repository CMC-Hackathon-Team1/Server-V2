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
import { errResponse, sucResponse } from '../_utilities/response';
import baseResponse from '../_utilities/baseResponseStatus';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody, ApiHeader,
  ApiOperation, ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { KakaoLogin } from './kakao/kakao.service';
import { kakaoConfig } from '../_config/kakao.config';
import { GoogleService } from './google/google.service';
import { AuthGuard } from "@nestjs/passport";

@ApiTags('로그인, 인증 API')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private kakaoService: KakaoLogin,
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
    return await this.authService.registerUser(userDTO);
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
    status: 1101,
    description: '로그인 정보 (이메일 or 비밀번호) 를 잘못 입력함.',
    schema: {
      example: errResponse(baseResponse.USER_NOT_FOUND),
    },
  })
  @Post('/login')
  async login(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any> {
    const jwtResult = await this.authService.validateUser(userDTO);
    // console.log(jwtResult);

    // [Validation 처리]
    // jwt 토큰이 없으면 에러메시지 반환
    if (!jwtResult.accessToken) {
      return res.send(jwtResult);
    }
    // ---

    // 쿠키 설정 (jwt 담기)
    // res.setHeader('Authorization', 'Bearer ' + jwtResult.accessToken);
    res.cookie('jwt', jwtResult.accessToken, {
      // domain: 'OnAndOff Login',
      httpOnly: true, // 브라우저에서의 쿠키 사용 막기 (XSS등의 보안강화용)
      // maxAge: 24 * 60 * 60 * 1000, // 1day
    });

    return res.send(
      sucResponse(baseResponse.SUCCESS, { userId: jwtResult.userId }),
    );

    // [쿠키로 jwt를 보낼거면, response에서 jwt 노출시키면 안됨] -> 아래 주석처리하고 위 주석해제하기
    // return res.send(
    //   response(baseResponse.SUCCESS, {
    //     jwtAccessToken: jwtResult.accessToken,
    //   }),
    // );
  }

  @UseGuards(JWTAuthGuard)
  @Get('/authenticate')
  async isAuthenticated(@Req() req: Request): Promise<any> {
    const user: any = req.user;
    // console.log(user);
    const userId: number = user.userId;
    // console.log(userId);
    // const email: string = user.email;

    const userInfo = await this.userService.getUserInfo(userId);

    return userInfo;
  }

  // 쿠키 가져오기
  @Get('/cookies')
  getCookies(@Req() req: Request, @Res() res: Response): any {
    const jwt = req.cookies['jwt'];

    // [Validation 처리]
    // 쿠키가 비어있으면 알려주기
    if (!jwt) {
      return res.send(errResponse(baseResponse.AUTH_COOKIE_JWT_EMPTY));
    }
    // ---

    return res.send({ jwt: jwt });
  }

  // API No. 4.1.4.3. 자체로그인 - 로그아웃 (쿠키의 jwt 값 삭제, 유효기간: 0 으로 변경)
  @ApiOperation({
    summary: '4.1.4.3. 자체 로그인 - 로그아웃',
    description: '로그아웃 한다. (헤더에 jwt 정보를 함께 보내세요)',
  })
  @ApiBearerAuth('Authorization')
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: { example: sucResponse(baseResponse.SUCCESS) },
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
    // [쿠키를 지우는 방법]
    res.cookie('jwt', '', {
      maxAge: 0,
    });

    return res.send(sucResponse(baseResponse.SUCCESS));
  }

  // API No. 4.1.1.1. 카카오 로그인 - 회원가입/로그인
  @ApiOperation({
    summary: '4.1.1.1. 카카오 로그인 - 회원가입/로그인',
    description: `카카오 계정을 통해 로그인/회원가입 한다. (이때, 카카오 계정과 연동된 이메일로 가입되도록 한다.) \n
        [Response Header, Cookie] - response에서 다음 2개 값이 넘어옵니다.\n
        1. response header - 'kakao-access-token' : '{카카오 액세스 토큰}',
        2. cookie - 'jwt={서비스 jwt값}' (또는 response header - 'set-cookie' : 'jwt={서비스 jwt값}'`,
  })
  @ApiQuery({
    name: 'code',
    required: true,
    description: '클라이언트에서 받은 카카오 인가코드',
    example: 'oDb1L9pz6qK3hdOMcop...',
  })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: {
      example: sucResponse(baseResponse.SUCCESS, {
        state: '로그인/회원가입 완료',
        userId: 555,
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
    status: 1011,
    description: '카카오 인가 코드를 request에서 넘겨주지 않음',
    schema: { example: errResponse(baseResponse.KAKAO_AUTH_CODE_EMPTY) },
  })
  @ApiResponse({
    status: 1012,
    description: '카카오 액세서 토큰을 받아오는데 실패함. (인가 코드가 잘못되었거나 유효하지 않음.)',
    schema: { example: errResponse(baseResponse.KAKAO_ACCESS_TOKEN_FAIL) },
  })
  @ApiResponse({
    status: 1014,
    description: '카카오 유저 정보를 불러오는데 실패함. (액세스 토큰이 잘못되었거나 유효하지 않음.)',
    schema: { example: errResponse(baseResponse.KAKAO_USER_INFO_FAIL) },
  })
  @Post('/kakao-login')
  async kakaoLogin(@Query('code') code: any, @Res() res: Response): Promise<any> {
    // 1. 클라이언트로부터 인가 코드 전달 받기 (query string)
    // const { code } = qs.code;
    if (!code) {
      return errResponse(baseResponse.KAKAO_AUTH_CODE_EMPTY);
    }

    const kakaoResult = await this.kakaoService.kakaoLogin(code);

    // [Validation 처리]
    // jwt 토큰이 없으면 에러메시지 반환
    if (!kakaoResult.serviceJwt) {
      return res.send(kakaoResult);
    }
    // ---

    // 쿠키 설정 (jwt 담기)
    res.setHeader('Kakao-Access-Token', kakaoResult.kakaoAccessToken);
    res.cookie('jwt', kakaoResult.serviceJwt, {
      // domain: 'OnAndOff Login',
      httpOnly: true, // 브라우저에서의 쿠키 사용 막기 (XSS등의 보안강화용)
      // maxAge: 24 * 60 * 60 * 1000, // 1day
    });

    return res.send(
      sucResponse(baseResponse.SUCCESS, {
        state: kakaoResult.message,
        userId: kakaoResult.socialUserId,
        // kakaoAccessToken: kakaoResult.kakaoAccessToken,
      }),
    );

    // 최종. 서비스 로그인 토큰 반환(발급)
    return kakaoResult;
  }

  @ApiOperation({
    summary: '※ 카카오 로그인 - 카카오 계정 정보 가져오기',
    description: `카카오 로그인을 통해 카카오 계정 정보를 볼 수 있습니다. (추후 이용 여부 결정)`,
  })
  @ApiHeader({
    name: 'kakao_token',
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
    const kakao_token = req.headers['kakao_token'];
    // console.log(kakao_token);
    if (!kakao_token) {
      return errResponse(baseResponse.KAKAO_ACCESS_TOKEN_EMPTY);
    }

    const getKakaoUser = this.kakaoService.getKakaoUserInfoByToken(kakao_token);

    return getKakaoUser;
  }

  // API No. 4.1.1.2. 카카오 로그인 - 로그아웃
  @ApiOperation({
    summary: '4.1.1.2. 카카오 로그인 - 로그아웃',
    description: `카카오 계정을 통해 로그아웃 한다. (추후 테스트와 보완이 필요함) \n
        [Response Header, Cookie] - 로그아웃 시, 다음 2가지를 처리합니다.\n
        1. kakao access token 말소 - 이후에 카카오 액세스 토큰을 다시 발급 받아야 로그인 가능합니다.
        2. cookie 정보 제거 - 서비스 jwt를 담았던 cookie (또는 response header['set-cookie']) 를 지워서 반환합니다.`,
  })
  @ApiBearerAuth('Authorization')
  @ApiHeader({
    name: 'kakao_token',
    required: true,
    description: `'카카오 액세스 토큰' + '서비스 jwt'를 함께 보내야합니다. (서비스 jwt는 자체로그인에서 사용하던 방식과 같음)`,
    example: 'oDb1L9pz6qK3hdOMcop...',
  })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: { example: baseResponse.SUCCESS },
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
    status: 1011,
    description: '카카오 인가 코드를 request에서 넘겨주지 않음',
    schema: { example: errResponse(baseResponse.KAKAO_AUTH_CODE_EMPTY) },
  })
  @ApiResponse({
    status: 1012,
    description: '카카오 액세서 토큰을 받아오는데 실패함. (인가 코드가 잘못되었거나 유효하지 않음.)',
    schema: { example: errResponse(baseResponse.KAKAO_ACCESS_TOKEN_FAIL) },
  })
  @ApiResponse({
    status: 1014,
    description: '카카오 유저 정보를 불러오는데 실패함. (액세스 토큰이 잘못되었거나 유효하지 않음.)',
    schema: { example: errResponse(baseResponse.KAKAO_USER_INFO_FAIL) },
  })
  @Post('/kakao-logout')
  @UseGuards(JWTAuthGuard)
  async kakaoLogout(@Req() req: Request, @Res() res: Response): Promise<any> {
    const kakao_token = req.headers['kakao_token'];

    // 카카오 액세스 토큰으로 카카오 로그아웃 호출하기
    const kakaoResult = await this.kakaoService.kakaoLogout(kakao_token);

    // 쿠키 지우기
    res.cookie('jwt', '', {
      maxAge: 0,
    });

    return res.send(kakaoResult);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request): Promise<void> {
    // initiate google oauth2 login flow
    // redirect google login page
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req: Request): Promise<any> {
    const { user } = req;
    if (!user) {
      return 'No user';
    }

    return {
      user: req.user,
    };
    // return this.googleService.googleLogin(req);
  }
}
