/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/
import { z } from 'zod';
import { ValueObject } from '../../../shared/value-object';

export const ReactionActionDataSchema = z.nullable(
  z.record(
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.array(z.union([z.string(), z.number(), z.boolean()])),
    ]),
  ),
);

export class ReactionActionData extends ValueObject<
  z.infer<typeof ReactionActionDataSchema>
> {
  private constructor(value: z.infer<typeof ReactionActionDataSchema>) {
    super(value);
  }

  public static create(value: unknown): ReactionActionData {
    const parsedData = ReactionActionDataSchema.parse(value);
    return new ReactionActionData(parsedData);
  }
}
