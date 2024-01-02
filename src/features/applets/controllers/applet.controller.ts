/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-30
 **/
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
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
import { AppletAPI } from '../contract';
import { ZodValidationPipe } from '../../../core/pipes/zod-validation-pipe';
import { CreateAppletCommand } from '../commands/create-applet/create-applet.command';
import { Request } from 'express';
import { GetUserAppletsQuery } from '../queries/get-user-applets/get-user-applets.query';
import { GetUserAppletQuery } from '../queries/get-user-applet/get-user-applet.query';
import { DeleteAppletCommand } from '../commands/delete-applet/delete-applet.command';
import { EditAppletCommand } from '../commands/edit-applet/edit-applet.command';

@Controller('users/:userId/applets')
@ApiTags('users/applets')
export class AppletController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':appletId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get an applet' })
  @ApiResponse({
    status: 200,
    description: 'Get an applet',
  })
  @ApiResponse({
    status: 404,
    description: 'Applet not found',
  })
  @ApiCookieAuth()
  async getApplet(
    @Param('userId', new ZodValidationPipe(AppletAPI.GetApplet.userIdSchema))
    userId: string,
    @Param(
      'appletId',
      new ZodValidationPipe(AppletAPI.GetApplet.appletIdSchema),
    )
    appletId: string,
    @Req() request: Request,
  ) {
    const user = request.user?.jwt;

    if (userId === '@me') {
      userId = user.id;
    }

    return await this.queryBus.execute(
      new GetUserAppletQuery(userId, appletId),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all user applets' })
  @ApiResponse({
    status: 200,
    description: 'Get all user applets',
  })
  @ApiCookieAuth()
  async getUserApplets(
    @Param(
      'userId',
      new ZodValidationPipe(AppletAPI.GetUserApplets.userIdSchema),
    )
    userId: string,
    @Req() request: Request,
  ) {
    const user = request.user?.jwt;

    if (userId === '@me') {
      userId = user.id;
    }

    return await this.queryBus.execute(new GetUserAppletsQuery(userId));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create an applet' })
  @ApiResponse({
    status: 201,
    description: 'Applet created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiCookieAuth()
  @ApiBody({
    schema: {
      type: AppletAPI.CreateApplet.openApiSchema.type,
      properties: AppletAPI.CreateApplet.openApiSchema.properties,
      example: AppletAPI.CreateApplet.openApiSchema.example,
    },
  })
  async createApplet(
    @Param('userId', new ZodValidationPipe(AppletAPI.CreateApplet.userIdSchema))
    userId: string,
    @Req() request: Request,
    @Body(new ZodValidationPipe(AppletAPI.CreateApplet.schema))
    data: AppletAPI.CreateApplet.Request,
  ) {
    const user = request.user?.jwt;

    if (userId === '@me') {
      userId = user.id;
    }

    await this.commandBus.execute(
      new CreateAppletCommand(
        data.name,
        data.description,
        userId,
        data.eventId,
        data.reactionId,
        data.eventConnectionId,
        data.reactionConnectionId,
        data.eventTriggerData,
        data.reactionParametersData,
      ),
    );

    return { message: 'Applet created' };
  }

  @Delete(':appletId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete an applet' })
  @ApiResponse({
    status: 200,
    description: 'Applet deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Applet not found',
  })
  @ApiCookieAuth()
  async deleteApplet(
    @Param('userId', new ZodValidationPipe(AppletAPI.DeleteApplet.userIdSchema))
    userId: string,
    @Param(
      'appletId',
      new ZodValidationPipe(AppletAPI.DeleteApplet.appletIdSchema),
    )
    appletId: string,
    @Req() request: Request,
  ) {
    const user = request.user?.jwt;

    if (userId === '@me') {
      userId = user.id;
    }

    await this.commandBus.execute(new DeleteAppletCommand(userId, appletId));

    return { message: 'Applet deleted' };
  }

  @Patch(':appletId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Edit an applet' })
  @ApiResponse({
    status: 200,
    description: 'Applet edited',
  })
  @ApiResponse({
    status: 404,
    description: 'Applet not found',
  })
  @ApiBody({
    schema: {
      type: AppletAPI.EditApplet.openApiSchema.type,
      properties: AppletAPI.EditApplet.openApiSchema.properties,
      example: AppletAPI.EditApplet.openApiSchema.example,
    },
  })
  @ApiCookieAuth()
  async editApplet(
    @Param('userId', new ZodValidationPipe(AppletAPI.EditApplet.userIdSchema))
    userId: string,
    @Param(
      'appletId',
      new ZodValidationPipe(AppletAPI.EditApplet.appletIdSchema),
    )
    appletId: string,
    @Req() request: Request,
    @Body(new ZodValidationPipe(AppletAPI.EditApplet.schema))
    data: AppletAPI.EditApplet.Request,
  ) {
    const user = request.user?.jwt;

    if (userId === '@me') {
      userId = user.id;
    }

    await this.commandBus.execute(
      new EditAppletCommand({
        id: appletId,
        name: data.name,
        description: data.description,
        eventId: data.eventId,
        reactionId: data.reactionId,
        eventConnectionId: data.eventConnectionId,
        reactionConnectionId: data.reactionConnectionId,
        eventTriggerData: data.eventTriggerData,
        reactionParametersData: data.reactionParametersData,
      }),
    );

    return { message: 'Applet edited' };
  }
}
