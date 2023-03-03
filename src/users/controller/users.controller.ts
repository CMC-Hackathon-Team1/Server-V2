import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTAuthGuard } from '../../auth/security/auth.guard.jwt';
import baseResponse from '../../common/utils/baseResponseStatus';
import { errResponse, sucResponse } from '../../common/utils/response';
import { EmailService } from '../../email/email.service';
import { ChangeUserStatusDto } from '../dto/changeUserStatus.dto';
import { SendMailDTO } from '../dto/sendMailDTO';
import { UserStatus } from '../enum/userStatus.enum';
import { UsersService } from '../service/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}

  @ApiOperation({
    summary: '로그인한 회원의 이메일 확인',
    description: `로그인 한 회원의 이메일을 불러오는 API.\n
      JWT 토큰에 들어있는 사용자의 ID를 통해 이메일을 불러옴`,
  })
  @ApiBearerAuth('Authorization')
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: { example: baseResponse.SUCCESS },
  })
  @ApiResponse({
    status: 401,
    description: 'JWT 오류',
    schema: { example: baseResponse.JWT_UNAUTHORIZED },
  })
  @ApiResponse({
    status: 501,
    description: 'DB 오류',
    schema: { example: baseResponse.DB_ERROR },
  })
  @ApiResponse({
    status: 1101,
    description: '이미 만료된 JWT(이미 탈퇴된 회원의 JWT)를 보내는 경우 또는 이메일 정보를 불러올 수 없는 경우',
    schema: { example: baseResponse.USER_NOT_FOUND },
  })
  @UseGuards(JWTAuthGuard)
  @Get('/email')
  async isAuthenticated(@Request() req: any): Promise<any> {
    const userInfo = await this.usersService.getUserEmailInfo(req);

    return userInfo;
  }

  // API No. 1.8.7 회원 탈퇴
  @ApiOperation({
    summary: '회원 탈퇴',
    description:
      '회원 탈퇴에 관한 API이며 JWT 토큰에 들어있는 사용자 ID를 사용해 탈퇴처리 합니다.\n\n회원 탈퇴는 회원의 status를 INACTIVE로 만드는 것이 아니라 DB에서 관련 게시물, 팔로우 등을 모두 삭제합니다.\n\n따라서, 클라이언트에서 사용자가 확실히 회원 탈퇴를 원하는지 확인하는 과정이 필요할 것 같습니다.',
  })
  @ApiBearerAuth('Authorization')
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
    schema: { example: baseResponse.JWT_UNAUTHORIZED },
  })
  @ApiResponse({
    status: 501,
    description: 'DB 오류',
    schema: { example: baseResponse.DB_ERROR },
  })
  @ApiResponse({
    status: 1101,
    description: '이미 만료된 JWT(이미 탈퇴된 회원의 JWT)를 보내는 경우',
    schema: { example: baseResponse.USER_NOT_FOUND },
  })
  @UseGuards(JWTAuthGuard)
  @Delete('/account')
  deleteUser(@Request() req: any) {
    return this.usersService.deleteUser(req);
  }

  @ApiOperation({
    summary: '문의사항 이메일 보내기 API',
    description:
      '문의사항 보내기에 관한 API이며 JWT 토큰에 들어있는 사용자 ID를 사용해 유저정보를 전달합니다.',
  })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: { example: baseResponse.SUCCESS },
  })
  @ApiResponse({
    status: 401,
    description: 'JWT 오류',
    schema: { example: baseResponse.JWT_UNAUTHORIZED },
  })
  @ApiResponse({
    status: 501,
    description: 'DB 오류',
    schema: { example: baseResponse.DB_ERROR },
  })
  @ApiResponse({
    status: 1101,
    description: '이미 만료된 JWT(이미 탈퇴된 회원의 JWT)를 보내는 경우',
    schema: { example: baseResponse.USER_NOT_FOUND },
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JWTAuthGuard)
  @Post('/send-mail')
  async sendMail(@Body() sendMailDTO: SendMailDTO, @Request() req: any) {
    const requestUserId = req.user.userId;
    const mailTo = `${process.env.GOOGLE_EMAIL_SERVICE}`;
    return await this.emailService.sendMail(
      mailTo,
      requestUserId,
      sendMailDTO.content,
    );
  }

  // 계정 공개상태 설정
  @ApiOperation({
    summary: '계정 공개상태 변경',
    description: 'ACTIVE / HIDDEN으로 구분되며 각각 공개 / 비공개 입니다.',
  })
  @ApiBearerAuth('Authorization')
  @ApiBody({
    schema: { example: { userStatus: 'ACTIVE 또는 HIDDEN' } },
  })
  @ApiResponse({
    status: 100,
    description: 'SUCCESS',
    schema: { example: baseResponse.SUCCESS },
  })
  @ApiResponse({
    status: 401,
    description: 'JWT 오류',
    schema: { example: baseResponse.JWT_UNAUTHORIZED },
  })
  @ApiResponse({
    status: 501,
    description: 'DB 오류',
    schema: { example: baseResponse.DB_ERROR },
  })
  @ApiResponse({
    status: 1103,
    description: '요청 Body 오류',
    schema: { example: baseResponse.USER_STATUS_ERROR },
  })
  @UseGuards(JWTAuthGuard)
  @Patch('/status')
  async changeUserStatus(
    @Body() changeUserStatusDto: ChangeUserStatusDto,
    @Request() req: any,
  ) {
    return await this.usersService.changeUserStatus(changeUserStatusDto, req);
  }
}
