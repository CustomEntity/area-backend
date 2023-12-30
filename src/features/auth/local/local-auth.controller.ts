/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationPipe } from '../../../core/pipes/zod-validation-pipe';
import { AuthAPI } from '../contract';
import { LocalAuthService } from './local-auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class LocalAuthController {
  constructor(private readonly localAuthService: LocalAuthService) {}

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: 209,
    description: 'An user with this email already exists.',
  })
  @ApiBody({
    schema: {
      type: AuthAPI.Local.Register.openApiSchema.type,
      properties: AuthAPI.Local.Register.openApiSchema.properties,
    },
  })
  async register(
    @Body(new ZodValidationPipe(AuthAPI.Local.Register.schema))
    body: AuthAPI.Local.Register.Request,
    @Res() res: Response,
  ) {
    return await this.localAuthService.register(body, res);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials.',
  })
  @ApiBody({
    schema: {
      type: AuthAPI.Local.Login.openApiSchema.type,
      properties: AuthAPI.Local.Login.openApiSchema.properties,
    },
  })
  async login(
    @Body(new ZodValidationPipe(AuthAPI.Local.Login.schema))
    body: AuthAPI.Local.Login.Request,
    @Res() res: Response,
  ) {
    return await this.localAuthService.login(body, res);
  }
}
