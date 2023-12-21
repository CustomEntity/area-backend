/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import {NestFactory} from '@nestjs/core';
import {ConfigService} from '@nestjs/config';
import {AppModule} from './core/app.module';
import {DomainExceptionFilter} from "./core/filters/domain-exception.filter";
import {HttpExceptionFilter} from "./core/filters/http-exception.filter";
import * as session from 'express-session';


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
        origin: function (origin, callback) {
            const allowedOrigins = ['http://localhost:5173'];
            const domainRegex = /^[a-z]+:\/\/(?:[^\/]*\.+)*lfdp\.eu/;
            const ngrokRegex = /^[a-z]+:\/\/(?:[^\/]*\.+)*ngrok-free\.app/;
            const serveoRegex = /^[a-z]+:\/\/(?:[^\/]*\.+)*serveo\.net/;
            if (
                !origin ||
                allowedOrigins.includes(origin) ||
                domainRegex.test(origin) ||
                ngrokRegex.test(origin) ||
                serveoRegex.test(origin)
            ) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    });
    app.useGlobalFilters(new DomainExceptionFilter(), new HttpExceptionFilter());

    const configService = app.get(ConfigService);
    const port = configService.get<number>('port') || 3000;
    server = await app.listen(port, '0.0.0.0');
}

bootstrap();
