/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../../shared/domain-error';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  private getStatus(errorType: string): number {
    switch (errorType) {
      case 'NotFound':
        return 404;
      case 'InvalidArgument':
        return 400;
      case 'Unauthorized':
        return 401;
      case 'Forbidden':
        return 403;
      case 'Conflict':
        return 409;
      default:
        return 500;
    }
  }

  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const code = exception.code;
    const message = exception.message;
    const errorType = exception.errorType;

    const status = this.getStatus(errorType);

    response.status(status).json({
      errorType,
      code,
      message,
    });
  }
}
