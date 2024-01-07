/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-20
 **/
import { z } from 'zod';
import { ValueObject } from '../../../shared/value-object';

export const ReactionSchema = z.object({
  id: z.string(),
  applicationId: z.string(),
  name: z.string(),
  description: z.string(),
  parametersMapping: z.record(
    z.object({
      type: z.string(),
      required: z.boolean(),
    }),
  ),
  createdAt: z.date(),
});

export class Reaction extends ValueObject<z.infer<typeof ReactionSchema>> {
  private constructor(value: z.infer<typeof ReactionSchema>) {
    super(value);
  }

  public static create(value: unknown): Reaction {
    const parsedData = ReactionSchema.parse(value);
    return new Reaction(parsedData);
  }
}
