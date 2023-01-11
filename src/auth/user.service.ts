import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import { Users } from '../entities/Users';
import {UserInfoDTO} from "./dto/user-info.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async findByFields(
    options: FindOneOptions<UserDTO>,
  ): Promise<Users | undefined> {
    return await this.userRepository.findOne(options);
  }

  async save(userDTO: UserDTO): Promise<Users | undefined> {
    return await this.userRepository.save(userDTO);
  }
}
