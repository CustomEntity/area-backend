/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

export type JwtPayload = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
};

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const extractJwtFromCookie = (req: Request) => {
      if (!req.headers.cookie) {
        return null;
      }
      const jwtCookie = req.headers.cookie
        .split(';')
        .find((c) => c.trim().startsWith('access_token='));

      return jwtCookie ? jwtCookie.split('=')[1] : null;
    };

    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwtSecret'),
    });
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    };
  }
}
