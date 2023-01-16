import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';

@ApiTags('Test API')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '서버 동작 테스트', description: '서버가 켜져있는지 테스트' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: 'jwt 인증 테스트', description: '헤더에 jwt 정보를 올바르게 넣었을 때 반환이 잘 되는지 테스트' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard('jwt'))
  @Get('/jwt-test')
  jwtTest(): string {
    return 'jwt hi';
  }
}
