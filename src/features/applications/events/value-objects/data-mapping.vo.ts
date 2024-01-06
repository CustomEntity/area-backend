/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-06
 **/
import { z } from 'zod';
import { ValueObject } from '../../../../shared/value-object';

export const DataMappingSchema = z.record(
  z.object({
    displayName: z.string(),
  }),
);

export class DataMapping extends ValueObject<
  z.infer<typeof DataMappingSchema>
> {
  private constructor(value: z.infer<typeof DataMappingSchema>) {
    super(value);
  }

  public static create(value: unknown): DataMapping {
    const parsedValue = DataMappingSchema.parse(value);
    return new DataMapping(parsedValue);
  }
}
