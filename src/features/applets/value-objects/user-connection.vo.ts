/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-20
 **/
import { z } from 'zod';
import { ValueObject } from '../../../shared/value-object';

export const UserConnectionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  applicationId: z.string(),
  name: z.string(),
  connectionCredentials: z.union([
    z.object({
      access_token: z.string(),
      refresh_token: z.string().optional(),
    }),
    z.object({
      api_key: z.string(),
    }),
  ]),
  createdAt: z.date(),
});

export class UserConnection extends ValueObject<
  z.infer<typeof UserConnectionSchema>
> {
  private constructor(value: z.infer<typeof UserConnectionSchema>) {
    super(value);
  }

  public static create(value: unknown): UserConnection {
    const parsedData = UserConnectionSchema.parse(value);
    return new UserConnection(parsedData);
  }
}
