/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-30
 **/
import { z } from 'zod';
import { ValueObject } from '../../../../shared/value-object';

export const ParametersMappingSchema = z.record(
  z.object({
    type: z.string(),
    required: z.boolean(),
  }),
);

export class ParametersMapping extends ValueObject<
  z.infer<typeof ParametersMappingSchema>
> {
  private constructor(value: z.infer<typeof ParametersMappingSchema>) {
    super(value);
  }

  public static create(value: unknown): ParametersMapping {
    const parsedValue = ParametersMappingSchema.parse(value);
    return new ParametersMapping(parsedValue);
  }
}
