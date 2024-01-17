/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './core/app.module';
import { DomainExceptionFilter } from './core/filters/domain-exception.filter';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let server: { close: (arg0: (err: any) => void) => void };

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unreachable code error
// Hack to fix BigInt serialization
BigInt.prototype.toJSON = function (): string {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'tauri://localhost',
      'tauri://',
      'https://lfdp.eu',
      'http://lfdp.eu',
      'http://tauri.localhost',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalFilters(new DomainExceptionFilter(), new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Area API')
    .setDescription('API documentation for the Area project')
    .setVersion('1.0')
    .addTag('users', 'Everything about users')
    .addTag('users/connections', 'Everything about users connections')
    .addTag('auth', 'Everything about authentication')
    .addTag('auth/oauth', 'Everything about oauth authentication')
    .addTag('users/applets', 'Everything about user applets')
    .addTag('execution-logs', 'Everything about execution logs')
    .addCookieAuth('access_token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3000;
  server = await app.listen(port, '0.0.0.0');
}

bootstrap();
