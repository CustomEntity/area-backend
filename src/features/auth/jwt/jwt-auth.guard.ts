/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import {ExecutionContext, ForbiddenException, Injectable} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new ForbiddenException('User not authenticated');
    }
    const req = context.switchToHttp().getRequest();
    req.user = { ...req.user, jwt: { ...user } };
    return req.user;
  }
}
