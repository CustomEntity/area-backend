/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-09
 **/

import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EpitechService } from './epitech.service';
import { JwtAuthGuard } from '../../../auth/jwt/jwt-auth.guard';
import { Request, Response } from 'express';

@Controller('auth/epitech')
@ApiTags('auth')
export class EpitechController {
  constructor(private readonly epitechService: EpitechService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Epitech authentication' })
  @ApiBody({
    description: 'Epitech api key',
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

    const isValid = await this.epitechService.verifyApiKey(api_key);
    if (!isValid) {
      res.status(401).send('Invalid api key');
      return;
    }
    await this.epitechService.connectUser(jwtPayload, api_key);

    res.status(200).send('Epitech account connected');
  }
}
