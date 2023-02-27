import { Injectable } from '@nestjs/common';
import { UserDTO } from '../dto/user.dto';
import { errResponse, sucResponse } from '../../common/utils/response';
import baseResponse from '../../common/utils/baseResponseStatus';
import { UserService } from '../user.service';
import * as nodemailer from 'nodemailer';

const ejs = require('ejs');

@Injectable()
export class OwnAuthService {
  constructor(private userService: UserService) {}

  async signUp(user: UserDTO): Promise<any> {
    // 이미 있는 계정인지 체크
    const userFind = await this.userService.findByFields({
      where: { email: user.email },
    });
    // console.log(userFind);

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

    // 1. 아예 없는 유저면, 유저를 인증 코드와 함께 임시 생성 (status = 'PENDING') -> 이메일로 인증코드와 보내기
    if (!userFind) {
      const pendingUser = await this.userService.tempSave(user, randomAuthCode);
      console.log(`임시 유저 생성 됨`);
      // 시간 안에 인증 완료하기 (1시간 - 60*60*1000, 10분 - 10*60*1000, 15초 - 15*1000)
      console.log('이메일 인증 코드 보냄. 유효기간 - 15초 ');
      this.setTimerForAuth(user, 10 * 60 * 1000);
    }
    // 2. PENDING 상태이면, 인증 코드 업데이트 -> 이메일 다시 보내기
    else if (userFind && userFind.status == 'PENDING') {
      const updatePendingUser = await this.userService.tempUpdate(userFind, randomAuthCode);
      console.log(`임시 유저 코드 재발급 됨`);
      // 시간 안에 인증 완료하기 (1시간 - 60*60*1000, 10분 - 10*60*1000, 15초 - 15*1000)
      console.log('이메일 인증 코드 보냄. 유효기간 - 15초 ');
      this.setTimerForAuth(user, 10 * 60 * 1000);
    }

    // 이메일 보내기
    const emailAuthResult = this.sendEmailAuth(user.email, randomAuthCode);
    // ---

    return sucResponse(baseResponse.SUCCESS, {
      state: '인증메일을 확인해주세요. 10분 이내에 답변하지 않으면 회원가입이 취소됩니다.',
    });
  }

  async authenticateAccount(email: string, authCode: string): Promise<any> {
    const userFind = await this.userService.findByEmail(email);
    // console.log(userFind);

    // [Validation 처리]
    // 회원이 없는 경우 (인증 요청이 만료되어 사라진 경우)
    if (!userFind) {
      return errResponse(baseResponse.EMAIL_NOTIFICATION_EXPIRED);
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
      console.log('User Activated');
    }

    return sucResponse(baseResponse.SUCCESS, {
      state: '회원가입이 완료되었습니다.',
    });
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
        user: process.env.MASTER_ACCOUNT_EMAIL,
        pass: process.env.GOOGLE_EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // 보내는 사람 (이메일)
    const hostSender = `${process.env.MASTER_ACCOUNT_NAME} <${process.env.MASTER_ACCOUNT_EMAIL}>`;
    // 리다이렉트 주소
    const redirectUrl = process.env.CLIENT_EMAIL_REDIRECT || 'http://localhost:5050/auth/signup-callback';
    // const redirectUrl = 'http://localhost:5050/auth/signup-callback';
    // 이메일 폼
    let authEmailForm;
    ejs.renderFile(
      process.env.PWD + '/config/emailAuthForm.ejs',
      { redirectUrl, email, authCode },
      (err, data) => {
        if (err) {
          console.log(err);
          return errResponse(baseResponse.EMAIL_AUTH_RENDER_FAILED);
        }
        authEmailForm = data;
        // console.log(authEmailForm);
      },
    );

    const mailOptions = {
      from: hostSender,
      to: email,
      subject: 'On-and-Off 회원가입',
      // text: '내용',
      html: authEmailForm,
    };
    // console.log(mailOptions);

    const sendEmailInfo = await transporter.sendMail(mailOptions,
      (error, info) => {
        if (error) {
          console.log(`error occurred: ${error}`);
          return errResponse(baseResponse.EMAIL_SEND_FAILED);
        } else {
          console.log(`email sent successfully`);
          // console.log(info);
        }
        transporter.close();
      },
    );
  }

  setTimerForAuth(user, timeLimit) {
    setTimeout(async () => {
      await this.userService.findByEmail(user.email).then(async (userInfo) => {
        if (userInfo) {
          const userStatus = userInfo.status;
          if (userStatus != 'ACTIVE') {
            console.log(`임시 유저 삭제 됨. 유저 id: ${userInfo.userId}`);
            await this.userService.deleteTempUser(user);
          } else {
            console.log(`임시 유저 인증 됨! 유저 id: ${userInfo.userId}`);
          }
        }
      });
    }, timeLimit); // 시간 제한
    // }, 15 * 1000); // 시간 제한 -> 15초
    // }, 10 * 60 * 1000); // 시간 제한 -> 10분
    // }, 60 * 60 * 1000); // 시간 제한 -> 1시간
  }
}
