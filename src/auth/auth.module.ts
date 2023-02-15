import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { Users } from '../common/entities/Users';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './security/jwt.strategy';
import { jwtConfig } from '../../config/jwt.config';
import { KakaoService } from './kakao/kakao.service';
import { GoogleService } from './google/google.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule,
    JwtModule.registerAsync(jwtConfig),
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, KakaoService, GoogleService],
})
export class AuthModule {}
