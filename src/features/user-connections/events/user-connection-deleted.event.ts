/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Event } from '../../../system/event/event-dispatcher.provider';
import { z } from 'zod';

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

export class UserConnectionDeletedEvent implements Event {
  constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly applicationId: string,
    public readonly name: string,
    public readonly connectionCredentials: z.infer<
      typeof ConnectionCredentialsSchema
    >,
  ) {}

  getName(): string {
    return UserConnectionDeletedEvent.name;
  }
}
