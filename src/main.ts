import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as expressBasicAuth from 'express-basic-auth';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
