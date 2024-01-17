/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: JwtAuthService) {}

  @Get('check')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Check if user is authenticated' })
  @ApiResponse({ status: 200, description: 'User is authenticated' })
  @ApiResponse({ status: 401, description: 'User is not authenticated' })
  async check(@Req() req: Request) {
    return req.user;
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User is logged out' })
  @ApiResponse({ status: 401, description: 'User is not authenticated' })
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('access_token');
    return res.status(200).send();
  }
}
