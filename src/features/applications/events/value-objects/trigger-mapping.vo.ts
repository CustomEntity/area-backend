/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/
import { z } from 'zod';
import { ValueObject } from '../../../../shared/value-object';

export const TriggerMappingSchema = z.nullable(
  z.record(
    z.object({
      type: z.string(),
      required: z.boolean(),
    }),
  ),
);

export class TriggerMapping extends ValueObject<
  z.infer<typeof TriggerMappingSchema>
> {
  private constructor(value: z.infer<typeof TriggerMappingSchema>) {
    super(value);
  }

  public static create(value: unknown): TriggerMapping {
    const parsedValue = TriggerMappingSchema.parse(value);
    return new TriggerMapping(parsedValue);
  }
}
