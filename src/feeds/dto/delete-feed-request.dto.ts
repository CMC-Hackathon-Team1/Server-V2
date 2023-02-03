import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class DeleteFeedDTO{
    @ApiProperty()
    @IsNumber()
    profileId:number;

    @ApiProperty()
    @IsNumber()
    feedId:number;
}