/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { ValueObject } from '../value-object';
import { z } from 'zod';

export class Email extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: unknown): Email {
    const schema = z.string().email('Invalid email address');
    const parsedValue = schema.parse(value);
    return new Email(parsedValue);
  }
}
