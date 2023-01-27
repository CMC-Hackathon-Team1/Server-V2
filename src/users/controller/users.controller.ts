import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTAuthGuard } from '../../auth/security/auth.guard.jwt';
import baseResponse from '../../common/utils/baseResponseStatus';
import { errResponse, sucResponse } from '../../common/utils/response';
import { UsersService } from '../service/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

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
  @Post('/delete')
  deleteUser(@Request() req: any) {
    return this.usersService.deleteUser(req);
  }
}
