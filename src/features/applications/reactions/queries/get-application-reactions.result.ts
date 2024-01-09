/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-02
 **/
import { IQueryResult } from '@nestjs/cqrs';
import { z } from 'zod';

export const ParametersMappingSchema = z.record(
  z.object({
    type: z.string(),
    required: z.boolean(),
    schema: z
      .union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.string()),
        z.array(z.number()),
      ])
      .optional(),
  }),
);

export class GetApplicationReactionsResult implements IQueryResult {
  readonly reactions?: {
    id: string;
    applicationId: string;
    name: string;
    description: string;
    parametersMapping: z.infer<typeof ParametersMappingSchema>;
    createdAt: Date;
  }[];
}
