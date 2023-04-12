import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class BlockProfileRequestDTO{
    @ApiProperty({
        description:"로그인 유저(프로필)의 id",
        example:1
    })
    @IsNotEmpty()
    @IsNumber()
    fromProfileId: number;

    @ApiProperty({
        description:"차단할 유저(프로필)의 id",
        example:4
    })
    @IsNotEmpty()
    @IsNumber()
    toProfileId: number;

    @ApiProperty({
        description:"차단할지, 차단 해제할지 유무",
        example:"BLOCK, UNBLOCK"
    })
    @IsNotEmpty()
    @IsString()
    type: String;
}