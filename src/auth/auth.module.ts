import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { Users } from '../entities/Users';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './security/passport.jwt.strategy';
import { jwtConfig } from '../config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule,
    JwtModule.registerAsync(jwtConfig),
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy],
})
export class AuthModule {}
