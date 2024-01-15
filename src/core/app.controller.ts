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
  async getAboutJson(@Req() req: Request, @Res() res: Response) {
    return res.json(await this.appService.getAboutJson(req));
  }

  @Get('health')
  @ApiOperation({ summary: 'Get health' })
  @ApiResponse({
    status: 200,
    description: 'Get health',
  })
  async getHealth(@Req() req: Request, @Res() res: Response) {
    return res.json('OK');
  }
}
