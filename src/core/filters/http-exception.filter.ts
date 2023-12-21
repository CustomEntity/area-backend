/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from '@nestjs/common';
import {Response} from 'express';
import {DomainError} from '../../shared/domain-error';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

    private getStatus(code: number): string {
        switch (code) {
            case 400:
                return 'bad-request';
            case 401:
                return 'unauthorized';
            case 403:
                return 'forbidden';
            case 404:
                return 'not-found';
            case 409:
                return 'conflict';
            case 500:
                return 'internal-server-error';
            default:
                return 'internal-server-error';
        }
    }

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const code = exception.getStatus();
        const message = exception.message;

        response.status(code).json({
            code: this.getStatus(code),
            message,
        });
    }
}
