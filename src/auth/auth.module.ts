import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { Users } from '../_entities/Users';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './security/jwt.strategy';
import { jwtConfig } from '../_config/jwt.config';
import { KakaoLogin } from './kakao/kakao.service';
import { GoogleStrategy } from './security/google.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule,
    JwtModule.registerAsync(jwtConfig),
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, KakaoLogin, GoogleStrategy],
})
export class AuthModule {}
