import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import { Users } from '../common/entities/Users';
import { UserInfoDTO } from './dto/user-info.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  // user id로 기본적인 유저 정보 가져오기
  async getUserInfo(userId: number) {
    const userInfo = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.userId', 'user.email', 'user.status', 'user.createdAt'])
      .where('user.userId = :id', { id: userId })
      .getOne();

    // const userInfo = await this.userRepository.findOne(userId);
    // console.log(userInfo);

    return userInfo;
  }

  // 조건으로 회원 1명 검색하기
  async findByFields(
    options: FindOneOptions<UserDTO>,  // 이메일+비밀번호로 검색하기
    // options: FindOneOptions<Users>,
  ): Promise<Users | undefined> {
    return await this.userRepository.findOne(options);
  }

  async findByEmail(email: string): Promise<Users | undefined> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  // 자체 회원가입 인증 전, 임시로 유저 생성
  async tempSave(pendingUser: UserDTO, authCode: string): Promise<any> {
    if (pendingUser.password !== null) {
      // 비밀번호 암호화
      await this.transformPassword(pendingUser);
    }
    return await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(Users)
      .values([
        {
          email: pendingUser.email,
          password: pendingUser.password,
          login_type: 'own',
          access_token: authCode,
          status: 'PENDING',
        },
      ])
      .execute();
  }
  // 이메일 인증만 다시 원하는 경우, 인증 코드 업데이트하기
  async tempUpdate(pendingUser: UserDTO, authCode: string): Promise<any> {
    if (pendingUser.password !== null) {
      // 비밀번호 암호화
      await this.transformPassword(pendingUser);
    }
    return await this.userRepository
      .createQueryBuilder()
      .update(Users)
      .set({ access_token: authCode })
      .where('email=:email', { email: pendingUser.email })
      .execute();
  }

  // 이메일 인증이 정상적으로 끝난 경우, 회원 상태 활성화하기
  async activateUser(pendingUser: UserDTO): Promise<any> {
    return await this.userRepository
      .createQueryBuilder()
      .update(Users)
      .set({ status: 'ACTIVE' })
      .where('email=:email', { email: pendingUser.email })
      .execute();
  }

  // 이메일+비밀번호 로 회원을 DB에 저장하기
  async save(userDTO: UserDTO, loginType: string, socialParams: any): Promise<any> {
    if (userDTO.password !== null) {
      // 비밀번호 암호화
      await this.transformPassword(userDTO);
    }
    // console.log(userDTO);

    // 자체로그인
    if (loginType == 'own') {
      return await this.userRepository.save(userDTO);
    }
    // 소셜로그인
    else {
      const { accessToken, idToken } = socialParams;
      return await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(Users)
        .values([
          {
            email: userDTO.email,
            password: userDTO.password,
            login_type: loginType,
            access_token: accessToken,
            provider_token: idToken,
          },
        ])
        .execute();
    }
  }

  async updateSocialParams(userId: number, socialParams: any) {
    const { accessToken, idToken } = socialParams;
    return await this.userRepository
      .createQueryBuilder()
      .update(Users)
      .set({ access_token: accessToken, provider_token: idToken })
      .where('userId = :userId', { userId: userId })
      .execute();
  }

  // 비밀번호 암호화하기
  async transformPassword(userDTO: UserDTO): Promise<void> {
    userDTO.password = await bcrypt.hash(userDTO.password, 10);
    return Promise.resolve();
  }

  async deleteTokens(userId: number) {
    return await this.userRepository
      .createQueryBuilder()
      .update(Users)
      .set({ access_token: null, provider_token: null })
      .where('userId = :userId', { userId: userId })
      .execute();
  }
}
