import { DocumentBuilder } from '@nestjs/swagger';

export class BaseAPIDocument {
  public builder = new DocumentBuilder();

  public initializeOptions() {
    const config = this.builder
      .setTitle('OnandOff')
      .setDescription('세상에 없던 멀티 페르소나 기록 플랫폼 OnandOff')
      .setVersion('2.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT 토큰을 입력하세요 (Bearer 뒷 부분)',
          name: 'JWT',
          in: 'header',
        },
        'Authorization',
      )
      // .addCookieAuth('authCookie', {
      //   type: 'http',
      //   in: 'Header',
      //   scheme: 'Bearer',
      // })
      .addTag('swagger')
      .build();

    return config;
  }
}
