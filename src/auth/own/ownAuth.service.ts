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
    // // 이메일에 보낼 인증 코드 생성 (랜덤 문자열)
    // // TODO: 토큰으로 바꿔서 보안을 더 강화할 수 있음.
    // const randomAuthCode = String(Math.random().toString(36).slice(2));
    // // console.log(randomAuthCode);
    //
    // // 아예 없는 유저면, 유저 임시 생성 (status = 'PENDING') - setTimeOut
    // if (!userFind) {
    //   const pendingUser = await this.userService.tempSave(user, randomAuthCode);
    // }
    // // PENDING 상태이면, 이메일 다시 보내기
    // else if (userFind && userFind.status == 'PENDING') {
    //   const updatePendingUser = await this.userService.tempUpdate(userFind, randomAuthCode);
    // }

    // setTimeout(async () => {
    //   console.log('이메일 인증 코드 보냄. 유효기간 - 1시간 ');
    //
    // }, 60 * 60 * 1000); // 시간 제한 -> 1시간

    // 이메일 보내기
    const emailAuthResult = this.sendEmailAuth(user.email, user.password);
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

  // async registerUser(newUser: UserDTO, loginType: string): Promise<object> {
  //   // 이미 있는 계정인지 체크
  //   const userFind = await this.userService.findByFields({
  //     where: { email: newUser.email },
  //   });
  //   console.log(userFind);
  //
  //   // [Validation 처리]
  //   // 이미 있는 계정인 경우
  //   if (userFind && userFind.status == 'ACTIVE') {
  //     return errResponse(baseResponse.USER_ALREADY_EXISTS);
  //   }
  //   // ---
  //   // [인증 절차]
  //   // 아직 인증 미완료된 경우
  //   if (userFind && userFind.status == 'PENDING') {
  //     console.log('PENDING CUSTOMER ACTION (EMAIL NOTIFICATION)');
  //     return errResponse(baseResponse.EMAIL_NOTIFICATION_FAILED);
  //   }
  //   // 나머지는 새로 만드는 계정인 경우
  //
  //   // 인증 완료된 경우 -> 회원 추가
  //   const addedUser = await this.userService.save(newUser, loginType, null);
  //   const result = {
  //     userId: addedUser.userId,
  //   };
  //
  //   return sucResponse(baseResponse.SUCCESS, result);
  // }

  async sendEmailAuth(email: string, password: string) {
    // [TEST ACCOUNT]
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
    // ---

    // TODO: NEED GOOGLE ACCOUNT SETTING!
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   host: 'smtp.gmail.com',
    //   // port: 465,
    //   // secure: true, // true for 465, false for other ports
    //   port: 587,
    //   auth: {
    //     user: String(process.env.MASTER_ACCOUNT_EMAIL),
    //     pass: String(process.env.MASTER_ACCOUNT_PASSWORD),
    //   },
    //   tls: {
    //     rejectUnauthorized: false,
    //   },
    // });

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
          console.log(`email success`);
          console.log(info);
        }
        transporter.close();
      },
    );

    // console.log(sendEmailInfo);
    // console.log('Message sent: %s', sendEmailInfo.messageId);
  }
}
