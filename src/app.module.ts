import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from './profiles/profiles.module';
import { Profiles } from './entities/Profiles';
import { Categories } from './entities/Categories';
import { FeedCategoryMapping } from './entities/FeedCategoryMapping';
import { FeedHashTagMapping } from './entities/FeedHashTagMapping';
import { FeedImgs } from './entities/FeedImgs';
import { Feeds } from './entities/Feeds';
import { FollowFromTo } from './entities/FollowFromTo';
import { HashTags } from './entities/HashTags';
import { Likes } from './entities/Likes';
import { Persona } from './entities/Persona';
import { ProfileHashTagMapping } from './entities/ProfileHashTagMapping';
import { QuestionContent } from './entities/QuestionContent';
import { Questions } from './entities/Questions';
import { Users } from './entities/Users';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: String(process.env.DEVELOPMENT_DB_HOST),
      port: Number(process.env.DEVELOPMENT_DB_PORT),
      username: String(process.env.DEVELOPMENT_DB_USER),
      password: String(process.env.DEVELOPMENT_DB_PASS),
      database: String(process.env.DEVELOPMENT_DB_NAME),
      entities: [
        Categories,
        FeedCategoryMapping,
        FeedHashTagMapping,
        FeedImgs,
        Feeds,
        FollowFromTo,
        HashTags,
        Likes,
        Persona,
        ProfileHashTagMapping,
        Profiles,
        QuestionContent,
        Questions,
        Users,
      ],
      synchronize: true,
    }),
    ProfilesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
