import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class BlockUserRequestDTO{
    @ApiProperty({
        description:"차단할 유저의 id",
        example:4
    })
    @IsNotEmpty()
    @IsNumber()
    toUserId: number;
}