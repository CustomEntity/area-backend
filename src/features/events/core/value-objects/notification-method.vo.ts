/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { ValueObject } from '../../../../shared/value-object';
import { z } from 'zod';

export const NotificationMethodSchema = z.enum(['webhook', 'polling']);

export class NotificationMethod extends ValueObject<
  z.infer<typeof NotificationMethodSchema>
> {
  private constructor(value: z.infer<typeof NotificationMethodSchema>) {
    super(value);
  }

  public static create(value: unknown): NotificationMethod {
    const parsedValue = NotificationMethodSchema.parse(value);
    return new NotificationMethod(parsedValue);
  }
}
