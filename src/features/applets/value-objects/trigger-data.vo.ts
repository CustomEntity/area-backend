/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/
import { z } from 'zod';
import { ValueObject } from '../../../shared/value-object';

export const TriggerDataSchema = z.nullable(
  z.record(
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.array(z.union([z.string(), z.number(), z.boolean()])),
    ]),
  ),
).optional();

export class TriggerData extends ValueObject<
  z.infer<typeof TriggerDataSchema>
> {
  private constructor(value: z.infer<typeof TriggerDataSchema>) {
    super(value);
  }

  public static create(value: unknown): TriggerData {
    const parsedData = TriggerDataSchema.parse(value);
    return new TriggerData(parsedData);
  }
}
