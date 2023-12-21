/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import {Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { Request, Response } from 'express';
import {AuthGuard} from "@nestjs/passport";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: JwtAuthService) {}

  @Get('check')
  @UseGuards(JwtAuthGuard)
  async check(@Req() req: Request) {
    return req.user;
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('access_token');
    return res.status(200).send();
  }
}
