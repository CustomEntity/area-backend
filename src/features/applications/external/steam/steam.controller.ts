/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {SteamService} from "./steam.service";

@Controller('auth/steam')
@ApiTags('auth')
export class SteamController {
  constructor(private readonly steamService: SteamService) {}

  @Post()
  @ApiOperation({ summary: 'Steam authentication' })
  async authenticate(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ) {}
}
