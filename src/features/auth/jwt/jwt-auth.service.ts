/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-auth.strategy';
import { Response } from 'express';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  login(payload: JwtPayload, res: Response) {
    const jwt = this.jwtService.sign({
      id: payload.id.toString(),
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    });

    res.cookie('access_token', jwt, {
      /*httpOnly: true,
      secure: process.env.NODE_ENV === 'production',*/
      domain: process.env.COOKIE_DOMAIN ?? 'localhost',
    });

    return {
      access_token: jwt,
    };
  }
}
