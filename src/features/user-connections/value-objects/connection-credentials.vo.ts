/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { z } from 'zod';
import { ValueObject } from '../../../shared/value-object';

export const ConnectionCredentialsSchema = z.union([
  z.object({
    access_token: z.string(),
    refresh_token: z.string().optional(),
  }),
  z.object({
    api_key: z.string(),
  }),
]);

export class ConnectionCredentials extends ValueObject<
  z.infer<typeof ConnectionCredentialsSchema>
> {
  private constructor(value: z.infer<typeof ConnectionCredentialsSchema>) {
    super(value);
  }

  public static create(value: unknown): ConnectionCredentials {
    const parsedValue = ConnectionCredentialsSchema.parse(value);
    return new ConnectionCredentials(parsedValue);
  }
}
