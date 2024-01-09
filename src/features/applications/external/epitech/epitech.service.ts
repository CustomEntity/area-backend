/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-09
 **/
import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  APPLICATION_REPOSITORY,
  ApplicationRepository,
} from '../../core/ports/application.repository';
import { JwtPayload } from '../../../auth/jwt/jwt-auth.strategy';
import { CreateUserConnectionCommand } from '../../../user-connections/commands/create-user-connection/create-user-connection.command';
import { Response } from 'express';

@Injectable()
export class EpitechService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
  ) {}

  async connectUser(jwtPayload: JwtPayload, api_key: string) {
    const application = await this.applicationRepository.findByName('epitech');

    if (!application) {
      throw new Error('Application not found');
    }
    await this.commandBus.execute(
      new CreateUserConnectionCommand(
        jwtPayload.id,
        application.name,
        application.id,
        'Epitech account',
        { api_key },
      ),
    );
  }

  async verifyApiKey(api_key: string) {
    try {
      await fetch(
        `https://tekme.eu/api/doors_open?token=${api_key}&door_name=SM1`,
      );
    } catch (error) {
      return false;
    }

    return true;
  }
}
