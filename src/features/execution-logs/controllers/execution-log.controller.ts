/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse, ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ZodValidationPipe } from '../../../core/pipes/zod-validation-pipe';
import { ExecutionLogAPI } from '../contract';
import { GetExecutionLogsByUserQuery } from '../queries/get-execution-logs-by-user/get-execution-logs-by-user.query';

@Controller('execution-logs')
@ApiTags('execution-logs')
export class ExecutionLogController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get execution logs by user' })
  @ApiResponse({
    status: 200,
    description: 'Get execution logs by user',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
    example: '@me',
    description: 'User id',
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
  async getExecutionLogsByUser(
    @Req() request: Request,
    @Res() response: Response,
    @Query(
      'page',
      new ZodValidationPipe(
        ExecutionLogAPI.GetExecutionLogsByUser.pageParamSchema,
      ),
    )
    page: number,
    @Query(
      'limit',
      new ZodValidationPipe(
        ExecutionLogAPI.GetExecutionLogsByUser.limitParamSchema,
      ),
    )
    limit: number,
    @Param(
      'userId',
      new ZodValidationPipe(
        ExecutionLogAPI.GetExecutionLogsByUser.userIdSchema,
      ),
    )
    userId: string,
  ) {
    const user = request.user?.jwt;

    if (userId === '@me') {
      userId = user.id;
    }

    return response
      .status(200)
      .send(
        await this.queryBus.execute(
          new GetExecutionLogsByUserQuery(userId, page, limit),
        ),
      );
  }
}
