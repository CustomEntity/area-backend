/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-31
 **/
import { IQueryResult } from '@nestjs/cqrs';
import { z } from 'zod';

export const TriggerDataSchema = z.nullable(
  z.record(
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.array(z.union([z.string(), z.number(), z.boolean()])),
    ]),
  ),
);

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

export class GetUserAppletsResult implements IQueryResult {
  readonly applets: {
    id: string;
    userId: string;
    eventId: string;
    eventTriggerData?: z.infer<typeof TriggerDataSchema>;
    eventConnectionId?: string;
    reactionId: string;
    reactionActionData?: z.infer<typeof ReactionActionDataSchema>;
    reactionConnectionId?: string;
    name: string;
    description: string;
    active: boolean;
    createdAt: Date;
  }[];
}
