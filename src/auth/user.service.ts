import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import { Users } from '../entities/Users';
import { UserInfoDTO } from './dto/user-info.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  // 이메일+비밀번호 로 회원 1명 검색하기
  async findByFields(
    options: FindOneOptions<UserDTO>,
  ): Promise<Users | undefined> {
    return await this.userRepository.findOne(options);
  }

  // 이메일+비밀번호 로 회원을 DB에 저장하기
  async save(userDTO: UserDTO): Promise<Users | undefined> {
    // 비밀번호 암호화
    await this.transformPassword(userDTO);
    // console.log(userDTO);

    return await this.userRepository.save(userDTO);
  }

  // 비밀번호 암호화하기
  async transformPassword(userDTO: UserDTO): Promise<void> {
    userDTO.password = await bcrypt.hash(userDTO.password, 10);
    return Promise.resolve();
  }
}
