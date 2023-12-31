/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Controller, Get, HttpCode, Req, Res, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { Request, Response } from 'express';
import { FindUserByIdQuery } from '../queries/find-user-by-id/find-user-by-id.query';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('@me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the current logged user' })
  @ApiResponse({
    status: 200,
    description: 'The current user',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiCookieAuth()
  async getMe(@Req() request: Request, @Res() response: Response) {
    const user = await this.queryBus.execute(
      new FindUserByIdQuery(request.user.jwt.id),
    );

    return response.status(200).send(user);
  }
}
