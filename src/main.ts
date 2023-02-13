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

  // firebase 관련
  const admin = require('firebase-admin');

  const serviceAccount = {
    "type": process.env.FIREBASE_ADMIN_TYPE,
    "project_id": process.env.FIREBASE_ADMIN_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    "client_email": process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_ADMIN_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_ADMIN_AUTH_URI,
    "token_uri": process.env.FIREBASE_ADMIN_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  await app.listen(PORT);
}

try {
  bootstrap();
} catch (e) {
  console.log(e);
}
