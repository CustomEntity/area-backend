/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-20
 **/
import { z } from 'zod';
import { ValueObject } from '../../../shared/value-object';

export const EventSchema = z.object({
  id: z.string(),
  applicationId: z.string(),
  name: z.string(),
  description: z.string(),
  notificationMethod: z.enum(['webhook', 'polling']),
  notificationParameters: z.nullable(
    z.record(
      z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.union([z.string(), z.number(), z.boolean()])),
      ]),
    ),
  ),
  triggerMapping: z.nullable(
    z.record(
      z.object({
        type: z.string(),
        required: z.boolean(),
      }),
    ),
  ),
  createdAt: z.date(),
});

export class Event extends ValueObject<z.infer<typeof EventSchema>> {
  private constructor(value: z.infer<typeof EventSchema>) {
    super(value);
  }

  public static create(value: unknown): Event {
    const parsedData = EventSchema.parse(value);
    return new Event(parsedData);
  }
}
