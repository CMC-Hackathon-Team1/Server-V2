import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../common/entities/Users';
import { UsersRepository } from '../users/users.repository';
import { EmailService } from './email.service';

@Module({
  imports:[TypeOrmModule.forFeature([Users])],
  providers: [EmailService,UsersRepository],
  exports:[EmailService,UsersRepository]
})
export class EmailModule {}
