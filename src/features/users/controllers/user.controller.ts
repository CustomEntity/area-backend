/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { Request, Response } from 'express';
import { FindUserByIdQuery } from '../queries/find-user-by-id/find-user-by-id.query';

@Controller('users')
export class UserController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() request: Request, @Res() response: Response) {
    const user = await this.queryBus.execute(
      new FindUserByIdQuery(request.user.jwt.id),
    );

    console.log('user', user);
    return response.status(200).send(user);
  }
}
