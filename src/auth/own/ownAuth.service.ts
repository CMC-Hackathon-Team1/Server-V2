import { Injectable } from '@nestjs/common';
import { UserDTO } from '../dto/user.dto';
import { errResponse, sucResponse } from '../../common/utils/response';
import baseResponse from '../../common/utils/baseResponseStatus';
import { UserService } from '../user.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class OwnAuthService {
  constructor(private userService: UserService) {}

  async signUp(user: UserDTO): Promise<any> {
    // 이미 있는 계정인지 체크
    const userFind = await this.userService.findByFields({
      where: { email: user.email },
    });
    console.log(userFind);

    // [Validation 처리]
    // 이미 있는 계정인 경우
    if (userFind && userFind.status == 'ACTIVE') {
      return errResponse(baseResponse.USER_ALREADY_EXISTS);
    }
    // ---

    // [인증 절차]
    // 이메일에 보낼 인증 코드 생성 (랜덤 문자열)
    // TODO: 토큰으로 바꿔서 보안을 더 강화할 수 있음.
    const randomAuthCode = String(Math.random().toString(36).slice(2));
    console.log(`인증 코드 발급됨 : ${randomAuthCode}`);

    // 아예 없는 유저면, 유저를 인증 코드와 함께 임시 생성 (status = 'PENDING') - setTimeOut
    if (!userFind) {
      const pendingUser = await this.userService.tempSave(user, randomAuthCode);
      console.log(`임시 유저 생성 됨: ${pendingUser.userId}`);
    }
    // PENDING 상태이면, 인증 코드 업데이트 -> 이메일 다시 보내기
    else if (userFind && userFind.status == 'PENDING') {
      const updatePendingUser = await this.userService.tempUpdate(userFind, randomAuthCode);
      console.log(`임시 유저 코드 재발급 됨`);
    }

    setTimeout(async () => {
      console.log('이메일 인증 코드 보냄. 유효기간 - 1시간 ');
      await this.userService.findByEmail(user.email).then(async (userInfo) => {
        if (userInfo) {
          const foundAuthCode = userInfo.access_token;
          if (foundAuthCode != randomAuthCode) {
            await this.userService.deleteTempUser(user);
            console.log(`임시 유저 삭제 됨`);
          }
          else {
            console.log('임시 유저 인증 됨!');
          }
        }
      });
    }, 15 * 1000); // 시간 제한 -> 15초
    // }, 60 * 60 * 1000); // 시간 제한 -> 1시간

    // 이메일 보내기
    const emailAuthResult = this.sendEmailAuth(user.email, randomAuthCode);
    // ---

    return sucResponse(baseResponse.SUCCESS, {
      state: '인증메일을 확인해주세요. 1시간 내에 답변하지 않으면 회원가입이 취소됩니다.',
    });
  }

  async authenticateAccount(email: string, authCode: string): Promise<any> {
    const userFind = await this.userService.findByFields({
      where: { email: email },
    });
    console.log(userFind);

    // [Validation 처리]
    // 회원이 없는 경우
    if (!userFind) {
      return errResponse(baseResponse.USER_NOT_FOUND);
    }
    // 현재 인증 중인 회원이 아닌 경우
    if (userFind.status != 'PENDING') {
      return errResponse(baseResponse.USER_WRONG_STATUS);
    }
    // 인증 코드가 잘못 된 경우
    if (userFind.access_token != authCode) {
      return errResponse(baseResponse.USER_AUTH_WRONG);
    }
    // ---

    // 회원 인증 상태 확정 (PENDING -> ACTIVE)
    else {
      const confirmedUser = await this.userService.activateUser(userFind);
    }

    return sucResponse(baseResponse.SUCCESS);
  }

  async sendEmailAuth(email: string, authCode: string) {
    // [TEST ACCOUNT]
    // const testAccount = await nodemailer.createTestAccount();
    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.ethereal.email',
    //   port: 587,
    //   secure: false, // true for 465, false for other ports
    //   auth: {
    //     user: testAccount.user, // generated ethereal user
    //     pass: testAccount.pass, // generated ethereal password
    //   },
    // });
    // ---

    // [DONE] NEED GOOGLE ACCOUNT SETTING! - 구글 계정 2단계 인증 + 앱 비밀번호 설정
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports (587)
      // port: 587,
      auth: {
        user: String(process.env.MASTER_ACCOUNT_EMAIL),
        pass: String(process.env.MASTER_ACCOUNT_PASSWORD),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `온앤오프팀 <hackathonerss@gmail.com>`,
      to: email,
      subject: 'On-and-Off 회원가입',
      text: '내용',
      html: '<b>hi3</b>',
    };

    const sendEmailInfo = await transporter.sendMail(mailOptions,
      (error, info) => {
        if (error) {
          console.log(`error occurred: ${error}`);
        } else {
          console.log(`email sent successfully`);
          console.log(info);
        }
        transporter.close();
      },
    );

    // console.log(sendEmailInfo);
    // console.log('Message sent: %s', sendEmailInfo.messageId);
  }
}
