/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { ValueObject } from '../../../../shared/value-object';
import { z } from 'zod';

export const AuthenticationParametersSchema = z.nullable(z.record(z.any()));

export class AuthenticationParameters extends ValueObject<
  z.infer<typeof AuthenticationParametersSchema>
> {
  private constructor(value: z.infer<typeof AuthenticationParametersSchema>) {
    super(value);
  }

  public static create(value: unknown): AuthenticationParameters {
    const parsedValue = AuthenticationParametersSchema.parse(value);
    return new AuthenticationParameters(parsedValue);
  }
}
