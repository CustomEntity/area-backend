/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserConnectionCommand } from '../../user-connections/commands/create-user-connection/create-user-connection.command';
import { JwtPayload } from '../../auth/jwt/jwt-auth.strategy';
import {
  APPLICATION_REPOSITORY,
  ApplicationRepository,
} from '../core/ports/application.repository';
import { SpotifyAuthPayload } from './spotify.strategy';

@Injectable()
export class SpotifyService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
  ) {}

  async connectUser(
    jwtPayload: JwtPayload,
    spotifyPayload: SpotifyAuthPayload,
  ) {
    const application = await this.applicationRepository.findByName('spotify');

    if (!application) {
      throw new Error('Application not found');
    }
    await this.commandBus.execute(
      new CreateUserConnectionCommand(
        jwtPayload.id,
        application.name,
        application.id,
        'Spotify ' + spotifyPayload.email,
        {
          access_token: spotifyPayload.accessToken,
          refresh_token: spotifyPayload.refreshToken,
        },
      ),
    );
  }
}
