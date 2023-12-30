/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('about.json')
  @ApiOperation({ summary: 'Get about.json' })
  @ApiResponse({
    status: 200,
    description: 'Get about.json',
  })
  getAboutJson(@Req() req: Request, @Res() res: Response) {
    // TODO: Fill the dynamic content of about.json
    const dynamicContent = {
      client: {
        host: req.headers.host,
      },
      server: {
        current_time: Date.now(),
        services: [],
      },
    };

    res.json(dynamicContent);
  }
}
