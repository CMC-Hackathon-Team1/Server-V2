import 'dotenv/config'

/*
    EMAIL_AUTH_EMAIL: 메일서버 이메일
    EMAIL_AUTH_PASSWORD: 메일서버 페스워드
    EMAIL_HOST: 메일서버
    EMAIL_FROM_USER_NAME: 보내는 사람 이름
*/

export default ()=>({
    email:{
        transport: {
            host: `${process.env.EMAIL_HOST}`,
            port: 587,
            auth: {
                user: `${process.env.EMAIL_AUTH_EMAIL}`,
                pass: `${process.env.EMAIL_AUTH_PASSWORD}`
            },
        },
        default:{
            from:`"${process.env.EMAIL_FROM_USER_NAME}"<${process.env.EMAIL_AUTH_EMAIL}>`,
        },
    },
});