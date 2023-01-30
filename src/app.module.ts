import { AwsService } from './aws/aws.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from './profiles/profiles.module';
import { PersonaModule } from './persona/persona.module';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './common/middleware/jwt.middleware';
import { Categories } from './common/entities/Categories';
import { FeedCategoryMapping } from './common/entities/FeedCategoryMapping';
import { FeedHashTagMapping } from './common/entities/FeedHashTagMapping';
import { FeedImgs } from './common/entities/FeedImgs';
import { Feeds } from './common/entities/Feeds';
import { FollowFromTo } from './common/entities/FollowFromTo';
import { HashTags } from './common/entities/HashTags';
import { Likes } from './common/entities/Likes';
import { Notice } from './common/entities/Notice';
import { Persona } from './common/entities/Persona';
import { ProfileHashTagMapping } from './common/entities/ProfileHashTagMapping';
import { Profiles } from './common/entities/Profiles';
import { QuestionContent } from './common/entities/QuestionContent';
import { Questions } from './common/entities/Questions';
import { Users } from './common/entities/Users';
import { Environment } from './common/utils/constants';
import { LikesModule } from './likes/likes.module';
import { FollowingModule } from './following/following.module';
import { FeedsModule } from './feeds/feeds.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === Environment.Development
          ? '.env.dev'
          : '.env.prod',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: String(process.env.DB_HOST),
      port: Number(process.env.DB_PORT),
      username: String(process.env.DB_USER),
      password: String(process.env.DB_PASS),
      database: String(process.env.DB_NAME),
      entities: [
        Categories,
        FeedCategoryMapping,
        FeedHashTagMapping,
        FeedImgs,
        Feeds,
        FollowFromTo,
        HashTags,
        Likes,
        Notice,
        Persona,
        ProfileHashTagMapping,
        Profiles,
        QuestionContent,
        Questions,
        Users,
      ],
      synchronize: false,
      logging: true,
    }),
    ProfilesModule,
    PersonaModule,
    AuthModule,
    LikesModule,
    FollowingModule,
    FeedsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, AwsService],
})
export class AppModule {}

// TODO: 미들웨어 적용시 아래로 변경
// export class AppModule implements NestModule{
//   configure(consumer: MiddlewareConsumer): any {
//     consumer
//       .apply(JwtMiddleware)
//       .forRoutes('auth');
//   }
// }
