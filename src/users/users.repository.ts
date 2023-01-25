import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../_entities/Users';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users)
    private usersTable: Repository<Users>,
  ) {}

  // 유저 삭제
  async deleteUserByUserId(userId: number) {
    return await this.usersTable.delete(userId);
  }
}
