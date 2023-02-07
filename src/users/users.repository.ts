import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../common/entities/Users';

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

  // 유저 정보 가져오기
  async getUserByUserId(userId: number) {
    return await this.usersTable.findOne({ where: { userId: userId } });
  }
}
