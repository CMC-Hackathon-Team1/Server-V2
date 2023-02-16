import { ApiProperty } from "@nestjs/swagger";
import dateFormatter from "../../common/utils/dateFormatter";
import { ProfileWithPersonaNameDto } from "./profileWithPersonaName.dto";

export class Profile {
  constructor(profileWIthPersonaDto: ProfileWithPersonaNameDto) {
    this.profileId = profileWIthPersonaDto.profileId,
    this.personaName = profileWIthPersonaDto.personaName,
    this.profileName = profileWIthPersonaDto.profileName,
    this.statusMessage = profileWIthPersonaDto.statusMessage,
    this.profileImgUrl = profileWIthPersonaDto.profileImgUrl,
    this.createdAt = dateFormatter(profileWIthPersonaDto.createdAt)
  }

  @ApiProperty()
  profileId: number;

  @ApiProperty()
  personaName: string;

  @ApiProperty()
  profileName: string;

  @ApiProperty()
  statusMessage: string;

  @ApiProperty()
  profileImgUrl: string;

  @ApiProperty()
  createdAt: string;
}
