/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import {Controller, Get, Param, Query, Req, Res, UseGuards} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { Request, Response } from 'express';
import { FindUserByIdQuery } from '../queries/find-user-by-id/find-user-by-id.query';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam, ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserAPI } from '../contract';
import GetAllUsers = UserAPI.GetAllUsers;
import { GetUsersQuery } from '../queries/get-users/get-users.query';
import { ZodValidationPipe } from '../../../core/pipes/zod-validation-pipe';

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

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'All users',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiCookieAuth()
  @ApiQuery({
    name: 'page',
    type: Number,
    required: true,
    example: 1,
    description: 'The page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: true,
    example: 20,
    description: 'The number of items per page',
  })
  async getAll(
    @Req() request: Request,
    @Res() response: Response,
    @Query('page', new ZodValidationPipe(UserAPI.GetAllUsers.pageParamSchema))
    page: number,
    @Query('limit', new ZodValidationPipe(UserAPI.GetAllUsers.limitParamSchema))
    limit: number,
  ) {
    const user = await this.queryBus.execute(new GetUsersQuery(page, limit));

    return response.status(200).send(user);
  }
}
