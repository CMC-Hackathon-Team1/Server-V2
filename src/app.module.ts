import { AwsService } from './aws/aws.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from './profiles/profiles.module';
import { PersonaModule } from './persona/persona.module';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './common/middleware/jwt.middleware';
import { Categories } from './common/entities/Categories';
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
import { StatisticsModule } from './statistics/statistics.module';
import { HashTagModule } from './hash-tag/hash-tag.module';
import { HashTagFeedMappingModule } from './hash-tag-feed-mapping/hash-tag-feed-mapping.module';
import { CategoriesModule } from './categories/categories.module';
import { AlarmsModule } from './alarms/alarms.module';
import { EmailModule } from './email/email.module';
import configEmail from '../config/email';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import path = require('path');
import { Reports } from './common/entities/Reports';
import { ReportContent } from './common/entities/ReportContent';
import { ReportCategory } from './common/entities/ReportCategory';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === Environment.Development
          ? '.env.dev'
          : '.env.prod',
      isGlobal: true,
      load: [configEmail],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // console.log('=== write [.env] by config: network ===');
        // console.log(config.get('email'));
        return {
          ...config.get('email'),
          template: {
            dir: path.join(__dirname, '/templates'),
            adapter: new EjsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
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
        Reports,
        ReportContent,
        ReportCategory,
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
    StatisticsModule,
    HashTagModule,
    HashTagFeedMappingModule,
    CategoriesModule,
    AlarmsModule,
    EmailModule,
    ReportsModule,
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
