/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SteamService } from './steam.service';
import { JwtAuthGuard } from '../../../auth/jwt/jwt-auth.guard';

@Controller('auth/steam')
@ApiTags('auth')
export class SteamController {
  constructor(private readonly steamService: SteamService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Steam authentication' })
  @ApiBody({
    description: 'Steam api key',
    schema: {
      type: 'object',
      properties: {
        api_key: {
          type: 'string',
        },
      },
    },
  })
  @ApiCookieAuth()
  async authenticate(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: { api_key: string },
  ) {
    const jwtPayload = req.user?.jwt;
    const api_key = body.api_key;

    const isValid = await this.steamService.checkUser(api_key);

    if (!isValid) {
      res.status(401).send('Invalid api key');
      return;
    }

    await this.steamService.connectUser(jwtPayload, api_key);

    res.status(200).send('Steam account connected');
  }
}
