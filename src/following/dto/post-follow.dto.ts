import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class PostFollowRequestDTO{
    @ApiProperty({
        description:"현재 더미데이터로 27,29,30번이 있습니다.",
        example:27
    })
    @IsNotEmpty()
    @IsNumber()
    fromProfileId: number;

    @ApiProperty({
        description:"현재 더미데이터로 27,29,30번이 있습니다.",
        example:30
    })
    @IsNotEmpty()
    @IsNumber()
    toProfileId: number;
   
}