/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-02
 **/
import { IQueryResult } from '@nestjs/cqrs';
import { z } from 'zod';

export const NotificationMethodSchema = z.enum(['webhook', 'polling']);

export const NotificationParametersSchema = z.nullable(
  z.record(z.union([z.string(), z.number(), z.array(z.string()), z.boolean()])),
);

export const TriggerMappingSchema = z.nullable(
  z.record(
    z.object({
      type: z.string(),
      required: z.boolean(),
    }),
  ),
);

export class GetApplicationEventsResult implements IQueryResult {
  readonly events?: {
    id: string;
    applicationId: string;
    name: string;
    description: string;
    notificationMethod: z.infer<typeof NotificationMethodSchema>;
    notificationParameters: z.infer<typeof NotificationParametersSchema>;
    triggerMapping: z.infer<typeof TriggerMappingSchema>;
    createdAt: Date;
  }[];
}
