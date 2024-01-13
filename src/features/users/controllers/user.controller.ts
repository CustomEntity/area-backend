/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { Request, Response } from 'express';
import { FindUserByIdQuery } from '../queries/find-user-by-id/find-user-by-id.query';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserAPI } from '../contract';
import { GetUsersQuery } from '../queries/get-users/get-users.query';
import { ZodValidationPipe } from '../../../core/pipes/zod-validation-pipe';
import { EditUserCommand } from '../commands/edit-user/edit-user.command';
import { DeleteUserCommand } from '../commands/delete-user/delete-user.command';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Delete(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'Delete a user',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
    example: '123456789',
    description: 'The user id',
  })
  @ApiCookieAuth()
  async deleteUser(
    @Req() request: Request,
    @Res() response: Response,
    @Param('userId', new ZodValidationPipe(UserAPI.DeleteUser.userIdSchema))
    userId: string,
  ) {
    const user = request.user?.jwt;

    if (userId === '@me') {
      userId = user.id;
    }

    await this.commandBus.execute(new DeleteUserCommand(userId));

    return response.status(200).send();
  }

  @Patch(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Edit a user' })
  @ApiResponse({
    status: 200,
    description: 'Edit a user',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
    example: '123456789',
    description: 'The user id',
  })
  @ApiCookieAuth()
  @ApiBody({
    schema: {
      type: UserAPI.EditUser.openApiSchema.type,
      properties: UserAPI.EditUser.openApiSchema.properties,
      example: UserAPI.EditUser.openApiSchema.example,
    },
  })
  async editUser(
    @Req() request: Request,
    @Res() response: Response,
    @Param('userId', new ZodValidationPipe(UserAPI.EditUser.userIdSchema))
    userId: string,
    @Body(new ZodValidationPipe(UserAPI.EditUser.schema))
    body: UserAPI.EditUser.Request,
  ) {
    const user = request.user?.jwt;

    if (userId === '@me') {
      userId = user.id;
    }

    await this.commandBus.execute(
      new EditUserCommand(userId, body.firstName, body.lastName),
    );

    return response.status(200).send();
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a user' })
  @ApiResponse({
    status: 200,
    description: 'Get a user',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiCookieAuth()
  async getUser(
    @Req() request: Request,
    @Res() response: Response,
    @Param('userId', new ZodValidationPipe(UserAPI.GetUser.userIdSchema))
    userId: string,
  ) {
    const user = request.user?.jwt;

    if (userId === '@me') {
      userId = user.id;
    }

    return response
      .status(200)
      .send(await this.queryBus.execute(new FindUserByIdQuery(userId)));
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
