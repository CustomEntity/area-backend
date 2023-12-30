/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Inject, Injectable } from '@nestjs/common';
import { JwtAuthService } from '../../jwt/jwt-auth.service';
import { CommandBus } from '@nestjs/cqrs';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../../users/ports/user.repository';
import { HASH_PROVIDER } from '../../../../system/hash/hash.provider';
import { ID_PROVIDER, IdProvider } from '../../../../system/id/id.provider';
import { GoogleAuthPayload } from './google.strategy';
import { CreateUserCommand } from '../../../users/commands/create-user/create-user.command';
import { Response } from 'express';
import { UserAlreadyExistsError } from '../../../users/exceptions/user-already-exists.error';

@Injectable()
export class GoogleService {
  constructor(
    private readonly authService: JwtAuthService,
    private readonly commandBus: CommandBus,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(ID_PROVIDER)
    private readonly idProvider: IdProvider,
  ) {}

  async login(
    payload: GoogleAuthPayload,
    res: Response,
  ): Promise<{ access_token: string }> {
    const user = await this.userRepository.findByEmail(payload.email);
    let id = undefined;
    if (!user) {
      id = this.idProvider.getId();

      await this.commandBus.execute(
        new CreateUserCommand(
          payload.firstName,
          payload.lastName,
          payload.email,
          id,
          undefined,
          payload.profilePictureUrl,
        ),
      );
    } else {
      if (user.hashedPassword) {
        throw new UserAlreadyExistsError(payload.email);
      }
      id = user.id;
    }

    const jwtPayload = {
      id: id.toString(),
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    };
    const jwt = this.authService.login(jwtPayload, res);
    return jwt;
  }
}
