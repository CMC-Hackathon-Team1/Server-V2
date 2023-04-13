
export class BlcokedProfileDTO{
    profileId: number;
    personaName: String;
    profileName: String;
    profileImgUrl: String;

    constructor(profileId:number,personaName: String, profileName: String, profileImgUrl: String) {
        this.profileId = profileId;
        this.personaName = personaName;
        this.profileName = profileName;
        this.profileImgUrl=profileImgUrl
	}
}