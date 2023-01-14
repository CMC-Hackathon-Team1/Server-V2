import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from './profiles/profiles.module';
import { PersonaModule } from './persona/persona.module';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './_middleware/jwt.middleware';
import { Categories } from './_entities/Categories';
import { FeedCategoryMapping } from './_entities/FeedCategoryMapping';
import { FeedHashTagMapping } from './_entities/FeedHashTagMapping';
import { FeedImgs } from './_entities/FeedImgs';
import { Feeds } from './_entities/Feeds';
import { FollowFromTo } from './_entities/FollowFromTo';
import { HashTags } from './_entities/HashTags';
import { Likes } from './_entities/Likes';
import { Notice } from './_entities/Notice';
import { Persona } from './_entities/Persona';
import { ProfileHashTagMapping } from './_entities/ProfileHashTagMapping';
import { Profiles } from './_entities/Profiles';
import { QuestionContent } from './_entities/QuestionContent';
import { Questions } from './_entities/Questions';
import { Users } from './_entities/Users';

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
        Notice,
        Persona,
        ProfileHashTagMapping,
        Profiles,
        QuestionContent,
        Questions,
        Users,
      ],
      synchronize: false,
    }),
    ProfilesModule,
    PersonaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
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
