import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as expressBasicAuth from 'express-basic-auth';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { BaseAPIDocument } from '../config/swagger.document.config';

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
  const swagger_config = new BaseAPIDocument().initializeOptions();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, swagger_config);
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
