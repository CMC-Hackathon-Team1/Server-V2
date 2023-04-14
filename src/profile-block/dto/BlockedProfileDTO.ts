import { ApiProperty } from '@nestjs/swagger';

export class BlcokedProfileDTO{
    @ApiProperty({description:"차단 해제를 위해 사용된다.",example:1})
    profileId: number;
    @ApiProperty({example:"작가"})
    personaName: String;
    @ApiProperty({example:"키키"})
    profileName: String;
    @ApiProperty({example:"https://~"})
    profileImgUrl: String;

    constructor(profileId:number,personaName: String, profileName: String, profileImgUrl: String) {
        this.profileId = profileId;
        this.personaName = personaName;
        this.profileName = profileName;
        this.profileImgUrl=profileImgUrl
	}
}