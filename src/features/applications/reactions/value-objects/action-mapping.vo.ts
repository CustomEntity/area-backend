/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-30
 **/
import { z } from 'zod';
import { ValueObject } from '../../../../shared/value-object';

export const ActionMappingSchema = z.record(
  z.object({
    type: z.string(),
    required: z.boolean(),
  }),
);

export class ActionMapping extends ValueObject<
  z.infer<typeof ActionMappingSchema>
> {
  private constructor(value: z.infer<typeof ActionMappingSchema>) {
    super(value);
  }

  public static create(value: unknown): ActionMapping {
    const parsedValue = ActionMappingSchema.parse(value);
    return new ActionMapping(parsedValue);
  }
}
