import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import baseResponse from '../common/utils/baseResponseStatus';
import { errResponse, sucResponse } from '../common/utils/response';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService:MailerService,private usersRepository: UsersRepository){}


    async _send(
        tos: string[],
        subject: string,
        templateName:string,
        context:any={},
    ):Promise<boolean>{
        await this.mailerService.sendMail({
            to:tos.join(', '),
            subject,
            template:`../../templates/${templateName}`,
            context,
        });

        return true;
    }

    async sendMail(to:string,userId:number,content:string){
        try{
            const user=await this.usersRepository.getUserByUserId(userId);
            const fromEmail: String = user.email;
            console.log(to, userId, content, user, fromEmail);
            await this._send(
                [to],
                '[On&Off 고객 문의사항]',
                'mailTemplate.ejs',
                {
                    fromEmail,
                    content
                }
            );
            return sucResponse(baseResponse.SUCCESS);
        }catch(err){
            return errResponse(baseResponse.DB_ERROR);
        }
        

    }
    
}
