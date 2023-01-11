import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { Users } from '../entities/Users';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
