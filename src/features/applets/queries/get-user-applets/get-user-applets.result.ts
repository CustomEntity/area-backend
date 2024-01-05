/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-31
 **/
import { IQueryResult } from '@nestjs/cqrs';
import { z } from 'zod';

export const TriggerDataSchema = z.record(
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.union([z.string(), z.number(), z.boolean()])),
  ]),
);

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

export const EventSchema = z.object({
  id: z.string(),
  applicationId: z.string(),
});

export const ReactionSchema = z.object({
  id: z.string(),
  applicationId: z.string(),
});

export class GetUserAppletsResult implements IQueryResult {
  readonly applets?: {
    id: string;
    userId: string;
    event: z.infer<typeof EventSchema>;
    eventTriggerData?: z.infer<typeof TriggerDataSchema>;
    eventConnectionId?: string;
    reaction: z.infer<typeof ReactionSchema>;
    reactionParametersData?: z.infer<typeof ReactionParametersDataSchema>;
    reactionConnectionId?: string;
    name: string;
    description: string;
    active: boolean;
    createdAt: Date;
  }[];
}
