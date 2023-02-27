import 'dotenv/config';

/*
    MASTER_ACCOUNT_NAME: 메일 보내는 사람 이름
    MASTER_ACCOUNT_EMAIL: 메일서버 이메일
    GOOGLE_EMAIL_PASSWORD: 메일서버 페스워드 (구글 앱 비밀번호)
    GOOGLE_EMAIL_SERVICE: 메일서버 (구글)
    GOOGLE_EMAIL_HOST: 메일서버 smtp
*/

export default () => ({
  email: {
    transport: {
      service: `${process.env.GOOGLE_EMAIL_SERVICE}`,
      host: `${process.env.GOOGLE_EMAIL_HOST}`,
      // port: 587,
      port: 465,
      secure: true, // true for 465, false for other ports (587)
      auth: {
        user: `${process.env.MASTER_ACCOUNT_EMAIL}`,
        pass: `${process.env.GOOGLE_EMAIL_PASSWORD}`,
      },
      // tls: {
      //   rejectUnauthorized: false,
      // },
    },
    mailOptions: {
      from: `${process.env.MASTER_ACCOUNT_NAME} <${process.env.MASTER_ACCOUNT_EMAIL}>`,
    },
  },
});
