/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { ICommand } from '@nestjs/cqrs';
import { z } from 'zod';
import { ApplicationRepository } from '../../../applications/core/ports/application.repository';

const ConnectionCredentialsSchema = z.union([
  z.string(),
  z.object({
    username: z.string(),
    password: z.string(),
  }),
  z.object({
    access_token: z.string(),
    refresh_token: z.string().optional(),
  }),
]);

export class CreateUserConnectionCommand implements ICommand {
  constructor(
      public readonly userId: string,
      public readonly applicationName: string,
      public readonly applicationId: string,
      public readonly name: string,
      public readonly connectionCredentials: z.infer<
          typeof ConnectionCredentialsSchema
      >,
  ) {}
}
