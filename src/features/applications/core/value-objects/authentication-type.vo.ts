/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { ValueObject } from '../../../../shared/value-object';
import { z } from 'zod';

export const AuthenticationTypeSchema = z.enum(['oauth2', 'basic']);

export class AuthenticationType extends ValueObject<
  z.infer<typeof AuthenticationTypeSchema>
> {
  private constructor(value: z.infer<typeof AuthenticationTypeSchema>) {
    super(value);
  }

  public static create(value: unknown): AuthenticationType {
    const parsedValue = AuthenticationTypeSchema.parse(value);
    return new AuthenticationType(parsedValue);
  }
}
