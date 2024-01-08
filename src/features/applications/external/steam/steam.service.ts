/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserConnectionCommand } from '../../../user-connections/commands/create-user-connection/create-user-connection.command';
import {
  APPLICATION_REPOSITORY,
  ApplicationRepository,
} from '../../core/ports/application.repository';
import SteamAPI = require('steamapi');
import { JwtPayload } from '../../../auth/jwt/jwt-auth.strategy';

@Injectable()
export class SteamService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
  ) {}

  async connectUser(jwtPayload: JwtPayload, api_key: string) {
    const application = await this.applicationRepository.findByName('steam');

    if (!application) {
      throw new Error('Application not found');
    }
    await this.commandBus.execute(
      new CreateUserConnectionCommand(
        jwtPayload.id,
        application.name,
        application.id,
        'Steam account',
        { api_key },
      ),
    );
  }

  async checkUser(api_key: string) {
    const steam = new SteamAPI(api_key);

    try {
      await steam.resolve('https://steamcommunity.com/id/frinka94');
    } catch (error) {
      return false;
    }

    return true;
  }
}
