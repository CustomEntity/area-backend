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
  name: z.string(),
  description: z.string(),
  notificationMethod: z.enum(['webhook', 'polling']),
  notificationParameters: z.nullable(
    z.record(
      z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.union([z.string(), z.number(), z.boolean()])),
      ]),
    ),
  ),
  triggerMapping: z.nullable(
    z.record(
      z.object({
        type: z.string(),
        required: z.boolean(),
      }),
    ),
  ),
  createdAt: z.date(),
});

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

export const UserConnectionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  applicationId: z.string(),
  application: z.object({
    id: z.string(),
    name: z.string(),
  }),
  name: z.string(),
  createdAt: z.date(),
});

export class GetUserAppletResult implements IQueryResult {
  readonly applet: {
    id: string;
    userId: string;
    event: z.infer<typeof EventSchema>;
    eventTriggerData?: z.infer<typeof TriggerDataSchema>;
    eventConnection?: z.infer<typeof UserConnectionSchema>;
    reaction: z.infer<typeof ReactionSchema>;
    reactionParametersData?: z.infer<typeof ReactionParametersDataSchema>;
    reactionConnection?: z.infer<typeof UserConnectionSchema>;
    name: string;
    description: string;
    active: boolean;
    createdAt: Date;
  };
}
