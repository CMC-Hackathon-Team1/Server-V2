import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../common/entities/Users';
import { UsersController } from './controller/users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './service/users.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule,TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository]
})
export class UsersModule {}
