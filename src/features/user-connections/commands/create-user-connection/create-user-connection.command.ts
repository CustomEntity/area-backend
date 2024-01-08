/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { ICommand } from '@nestjs/cqrs';
import { z } from 'zod';

const ConnectionCredentialsSchema = z.union([
  z.object({
    access_token: z.string(),
    refresh_token: z.string().optional(),
  }),
  z.object({
    api_key: z.string(),
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
