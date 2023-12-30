/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { GithubGuard } from './github.guard';
import { GithubAuthPayload } from './github.strategy';
import { GithubService } from './github.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { JwtPayload } from '../../auth/jwt/jwt-auth.strategy';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth/oauth/github')
@ApiTags('auth/oauth')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get()
  @UseGuards(GithubGuard)
  @ApiOperation({ summary: 'Redirect to github oauth' })
  async GithubAuth() {}

  @Get('callback')
  @UseGuards(GithubGuard, JwtAuthGuard)
  @ApiOperation({ summary: 'Github oauth callback' })
  async GithubAuthCallback(@Req() req: Request, @Res() res: Response) {
    const jwtPayload = req.user?.jwt as unknown as JwtPayload;
    const githubPayload = req.user?.github as unknown as GithubAuthPayload;

    await this.githubService.connectUser(jwtPayload, githubPayload);
    return res.status(200).send();
  }
}
