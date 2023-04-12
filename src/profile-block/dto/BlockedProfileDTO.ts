
export class BlcokedProfileDTO{
    personaName: String;
    profileName: String;
    profileImgUrl: String;

    constructor(personaName:String,profileName:String,profileImgUrl:String) {
        this.personaName = personaName;
        this.profileName = profileName;
        this.profileImgUrl=profileImgUrl
	}
}