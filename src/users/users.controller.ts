import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from '../auth/security/auth.guard.jwt';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // API No. 1.8.7 회원 탈퇴
  @UseGuards(JWTAuthGuard)
  @Post('/delete')
  deleteUser(@Request() req: any) {
    return this.usersService.deleteUser(req);
  }
}
