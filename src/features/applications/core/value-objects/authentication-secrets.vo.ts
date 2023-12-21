/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { ValueObject } from '../../../../shared/value-object';
import { z } from 'zod';

export const AuthenticationSecretsSchema = z.record(
  z.union([z.string(), z.number(), z.array(z.string()), z.boolean()]),
);

export class AuthenticationSecrets extends ValueObject<
  z.infer<typeof AuthenticationSecretsSchema>
> {
  private constructor(value: z.infer<typeof AuthenticationSecretsSchema>) {
    super(value);
  }

  public static create(value: unknown): AuthenticationSecrets {
    const parsedValue = AuthenticationSecretsSchema.parse(value);
    return new AuthenticationSecrets(parsedValue);
  }
}
