import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
      database: 'dev',
      entities: [],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
