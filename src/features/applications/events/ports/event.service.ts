/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-21
 **/
import { z } from 'zod';

export const TriggerDataSchema = z.record(
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.union([z.string(), z.number(), z.boolean()])),
  ]),
);

export const EventDataSchema = z.record(
  z.string().optional().nullable(),
);

export const ConnectionCredentialsSchema = z.record(
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.union([z.string(), z.number(), z.boolean()])),
  ]),
);

export const EVENT_SERVICE = Symbol('EVENT_SERVICE');

export interface EventService {
  retrieveNewEventsData(
    appletId: string,
    applicationName: string,
    eventName: string,
    eventTriggerData: z.infer<typeof TriggerDataSchema>,
    eventConnectionCredentials: z.infer<typeof ConnectionCredentialsSchema>,
  ): Promise<z.infer<typeof EventDataSchema>[]>;
}
