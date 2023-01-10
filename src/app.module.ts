import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from './profiles/profiles.module';
import { Profile } from './profiles/profile.entity';

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
      entities: [Profile],
      synchronize: true,
    }),
    ProfilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
