/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-23
 **/

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { DeleteUserConnectionCommand } from '../commands/delete-user-connection/delete-user-connection.command';
import { Response, Request } from 'express';
import { RenameUserConnectionCommand } from '../commands/rename-user-connection/rename-user-connection.command';
import { ZodValidationPipe } from '../../../core/pipes/zod-validation-pipe';
import { UserConnectionAPI } from '../contract';
import { GetUserConnectionsQuery } from '../queries/get-user-connections/get-user-connections.query';
import { GetUserConnectionQuery } from '../queries/get-user-connection/get-user-connections.query';

@Controller('users/:userId/connections')
@ApiTags('users/connections')
export class UserConnectionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all user connections' })
  @ApiResponse({
    status: 200,
    description: 'Get all user connections',
  })
  @ApiCookieAuth()
  async getUserConnections(
    @Req() request: Request,
    @Res() response: Response,
    @Param(
      'userId',
      new ZodValidationPipe(UserConnectionAPI.GetUserConnections.userIdSchema),
    )
    userId: string,
  ) {
    const user = request.user?.jwt;

    if (userId === '@me') {
      userId = user.id;
    }
    const userConnections = await this.queryBus.execute(
      new GetUserConnectionsQuery(userId),
    );

    return response.status(200).send(userConnections);
  }

  @Get(':connectionId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a user connection' })
  @ApiResponse({
    status: 200,
    description: 'Get a user connection',
  })
  @ApiCookieAuth()
  async getUserConnection(
    @Req() request: Request,
    @Res() response: Response,
    @Param(
      'userId',
      new ZodValidationPipe(UserConnectionAPI.GetUserConnection.userIdSchema),
    )
    userId: string,
    @Param(
      'connectionId',
      new ZodValidationPipe(
        UserConnectionAPI.GetUserConnection.connectionIdSchema,
      ),
    )
    connectionId: string,
  ) {
    const user = request.user?.jwt;

    if (userId === '@me') {
      userId = user.id;
    }
    const userConnection = await this.queryBus.execute(
      new GetUserConnectionQuery(userId, connectionId),
    );

    return response.status(200).send(userConnection);
  }

  @Delete(':connectionId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a connection' })
  @ApiResponse({
    status: 200,
    description: 'The connection has been deleted successfully.',
  })
  @ApiCookieAuth()
  async deleteConnection(
    @Req() request: Request,
    @Res() response: Response,
    @Param(
      'userId',
      new ZodValidationPipe(UserConnectionAPI.GetUserConnections.userIdSchema),
    )
    userId: string,
    @Param(
      'connectionId',
      new ZodValidationPipe(
        UserConnectionAPI.DeleteUserConnection.connectionIdSchema,
      ),
    )
    connectionId: string,
  ) {
    const user = request.user?.jwt;

    if (userId === '@me') {
      userId = user.id;
    }
    await this.commandBus.execute(
      new DeleteUserConnectionCommand(user.id, connectionId),
    );

    return response.status(200).send({
      message: 'The connection has been deleted successfully.',
    });
  }

  @Patch(':connectionId/rename')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Rename a connection' })
  @ApiResponse({
    status: 200,
    description: 'The connection has been renamed successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'The user is not allowed to rename this connection.',
  })
  @ApiCookieAuth()
  @ApiBody({
    schema: {
      type: UserConnectionAPI.Rename.openApiSchema.type,
      properties: UserConnectionAPI.Rename.openApiSchema.properties,
    },
  })
  async renameConnection(
    @Req() request: Request,
    @Res() response: Response,
    @Param(
      'userId',
      new ZodValidationPipe(UserConnectionAPI.GetUserConnections.userIdSchema),
    )
    userId: string,
    @Param(
      'connectionId',
      new ZodValidationPipe(
        UserConnectionAPI.DeleteUserConnection.connectionIdSchema,
      ),
    )
    connectionId: string,
    @Body(new ZodValidationPipe(UserConnectionAPI.Rename.schema))
    body: UserConnectionAPI.Rename.Request,
  ) {
    const user = request.user?.jwt;

    if (userId === '@me') {
      userId = user.id;
    }
    await this.commandBus.execute(
      new RenameUserConnectionCommand(user.id, connectionId, body.name),
    );

    return response.status(200).send({
      message: 'The connection has been renamed successfully.',
    });
  }
}
