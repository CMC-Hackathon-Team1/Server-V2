import { ApiProperty } from '@nestjs/swagger';
import { TokenFileWebIdentityCredentials } from 'aws-sdk';
import { IsNotEmpty } from 'class-validator';
import { Feeds } from '../../common/entities/Feeds';
import { ExploreOptions } from '../enum/expore-options-enum';

export class PostFeedRequestDTO {
  @ApiProperty()
  @IsNotEmpty()
  profileId: number;

  @ApiProperty()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty()
  hashTagList: string[];

  @ApiProperty()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  isSecret: ExploreOptions;

  static DTOtoEntity(postFeedRequestDTO: PostFeedRequestDTO): Feeds {
    let feedEntity: Feeds = new Feeds();
    feedEntity.profileId = postFeedRequestDTO.profileId;
    feedEntity.content = postFeedRequestDTO.content;
    feedEntity.isSecret = postFeedRequestDTO.isSecret;
    feedEntity.categoryId = postFeedRequestDTO.categoryId;
    return feedEntity;
  }
}
