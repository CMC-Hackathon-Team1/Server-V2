import { ApiProperty } from '@nestjs/swagger';
import { TokenFileWebIdentityCredentials } from 'aws-sdk';
import { Feeds } from '../../common/entities/Feeds';
import { ExploreOptions } from '../enum/expore-options-enum';

export class PostFeedRequestDTO {
  @ApiProperty()
  profileId: number;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  hashTagList: string[];

  @ApiProperty()
  content: string;

  @ApiProperty()
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
