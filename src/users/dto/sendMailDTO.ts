import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SendMailDTO{
    @ApiProperty()
    @IsString()
    content:string;
}