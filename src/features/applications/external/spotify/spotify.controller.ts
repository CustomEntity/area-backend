/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { SpotifyGuard } from './spotify.guard';
import { SpotifyAuthPayload } from './spotify.strategy';
import { SpotifyService } from './spotify.service';
import { JwtAuthGuard } from '../../../auth/jwt/jwt-auth.guard';
import { JwtPayload } from '../../../auth/jwt/jwt-auth.strategy';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth/oauth/spotify')
@ApiTags('auth/oauth')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get()
  @UseGuards(SpotifyGuard)
  @ApiOperation({ summary: 'Redirect to spotify oauth' })
  async SpotifyAuth() {}

  @Get('callback')
  @UseGuards(SpotifyGuard, JwtAuthGuard)
  @ApiOperation({ summary: 'Spotify oauth callback' })
  async SpotifyAuthCallback(@Req() req: Request, @Res() res: Response) {
    const jwtPayload = req.user?.jwt as unknown as JwtPayload;
    const spotifyPayload = req.user?.spotify as unknown as SpotifyAuthPayload;

    if (req.query.state) {
      const state = Buffer.from(req.query.state as string, 'base64').toString(
        'ascii',
      );

      await this.spotifyService.connectUser(jwtPayload, spotifyPayload);
      return res.redirect(state);
    }
    await this.spotifyService.connectUser(jwtPayload, spotifyPayload);
    return res.status(200).send();
  }
}
