/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/
import { z } from 'zod';
import { ValueObject } from '../../../shared/value-object';

export const ReactionParametersDataSchema = z.nullable(
  z.record(
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.array(z.union([z.string(), z.number(), z.boolean()])),
    ]),
  ),
);

export class ReactionParametersData extends ValueObject<
  z.infer<typeof ReactionParametersDataSchema>
> {
  private constructor(value: z.infer<typeof ReactionParametersDataSchema>) {
    super(value);
  }

  public static create(value: unknown): ReactionParametersData {
    const parsedData = ReactionParametersDataSchema.parse(value);
    return new ReactionParametersData(parsedData);
  }
}
