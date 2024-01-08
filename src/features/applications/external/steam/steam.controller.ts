
/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import {Body, Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import { Request, Response } from 'express';
import { SpotifyGuard } from './spotify.guard';
import { SpotifyAuthPayload } from './spotify.strategy';
import { SpotifyService } from './spotify.service';
import { JwtAuthGuard } from '../../../auth/jwt/jwt-auth.guard';
import { JwtPayload } from '../../../auth/jwt/jwt-auth.strategy';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth/steam')
@ApiTags('auth')
export class SteamController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Post()
  @ApiOperation({ summary: 'Steam authentication' })
  async authenticate(@Req() req: Request, @Res() res: Response, @Body() body: any) {
  ) {

  }
}
