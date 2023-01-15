import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as expressBasicAuth from 'express-basic-auth';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('OnandOff')
    .setDescription('세상에 없던 멀티 페르소나 기록 플랫폼 OnandOff')
    .setVersion('2.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT 토큰을 입력하세요 (Bearer 뒷 부분)',
      name: 'JWT',
      in: 'header'
    }, 'Authorization')
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const PORT = process.env.SERVER_PORT;
  console.log(
    `OnandOff-Server is now listening to ${process.env.SERVER_HOST}:${PORT}`,
  );

  await app.listen(PORT);
}

try {
  bootstrap();
} catch (e) {
  console.log(e);
}
