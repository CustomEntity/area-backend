/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleGuard } from './google.guard';
import { Request, Response } from 'express';
import { GoogleAuthPayload } from './google.strategy';
import { GoogleService } from './google.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth/oauth/google')
@ApiTags('auth/oauth')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get()
  @UseGuards(GoogleGuard)
  @ApiOperation({ summary: 'Redirect to google oauth' })
  async googleAuth(@Req() req: Request) {}

  @Get('callback')
  @UseGuards(GoogleGuard)
  @ApiOperation({ summary: 'Google oauth callback' })
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const authPayload = req.user?.google as unknown as GoogleAuthPayload;

    if (req.query.state) {
      const state = Buffer.from(req.query.state as string, 'base64').toString(
        'ascii',
      );

      const { access_token } = await this.googleService.login(authPayload, res);
      return res.redirect(state + '?access_token=' + access_token);
    }
    return res
      .status(200)
      .send(await this.googleService.login(authPayload, res));
  }
}
