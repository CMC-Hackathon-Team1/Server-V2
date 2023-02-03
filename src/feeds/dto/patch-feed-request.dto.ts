import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsString } from "class-validator";
import { ExploreOptions } from "../enum/expore-options-enum";
import { FeedSecret } from "../enum/feed-secret-enum";

export class PatchFeedRequestDTO{
    @ApiProperty({
        description:"27로 테스트해보길 추천"
    })
    @IsInt()
    profileId:number;

    @ApiProperty({
        description:"1로 테스트해보길 추천"
    })
    @IsInt()
    feedId:number;

    @ApiProperty({
        description:"이전 api를 통해 받은 categoryId를 사용한다."
    })
    @IsInt()
    categoryId:number;    // 긁어와서 확인.
    
    @ApiProperty({
        description:"유저가 입력한 hashTagName을 배열형태로 전달해준다."
    })
    @IsArray()
    hashTagList:string[];       // 긁어와서 확인.
    
    @ApiProperty({
        description:""
    })
    @IsString()
    content:string;
    
    @ApiProperty({
        description:"공개여부에 따라 PUBLIC OR PRIVATE으로 전달한다.(대문자로 전달)",
        enum:FeedSecret
    })
    @IsString()
    isSecret:FeedSecret;   //PUBLIC OR PRIVATE

}