import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBlock } from '../common/entities/UserBlock';
import { Users } from '../common/entities/Users';
import { UsersRepository } from '../users/users.repository';
import { UserBlockController } from './user-block.controller';
import { UserBlockRepository } from './user-block.repository';
import { UserBlockService } from './user-block.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserBlock,Users])
  ],
  controllers: [UserBlockController],
  providers: [UserBlockService, UsersRepository, UserBlockRepository],
  exports: [UsersRepository, UserBlockRepository]
})
export class UserBlockModule {}
