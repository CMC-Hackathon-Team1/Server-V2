import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class PostLikeRequestDTO{
    @ApiProperty({
        description:"현재 더미데이터로 27,29,30번이 있습니다.",
        example:27
    })
    @IsNotEmpty()
    @IsNumber()
    profileId: number;

    @ApiProperty({
        description:"현재 더미데이터로 1,2,3번이 있습니다.",
        example:1
    })
    @IsNotEmpty()
    @IsNumber()
    feedId: number;
   
}