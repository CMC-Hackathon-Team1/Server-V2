import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from './dto/user.dto';
import { JWTAuthGuard } from './security/auth.guard.jwt';
import { Request, Response } from 'express';
import { errResponse, sucResponse } from '../_utilities/response';
import baseResponse from '../_utilities/baseResponseStatus';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('로그인, 인증 API')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  // API No. 4.1.4.1. 자체로그인 - 회원가입
  @ApiOperation({
    summary: '자체 로그인 - 회원가입 API',
    description: '이메일,비밀번호로 직접 회원가입한다.',
  })
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
    status: 1010,
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
    status: 1011,
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
    res.setHeader('Authorization', 'Bearer ' + jwtResult.accessToken);
    res.cookie('jwt', jwtResult.accessToken, {
      // domain: 'OnAndOff Login',
      httpOnly: true,              // 브라우저에서의 쿠키 사용 막기 (XSS등의 보안강화용)
      maxAge: 24 * 60 * 60 * 1000, // 1day
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
  @ApiBearerAuth('Authorization')
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
}
