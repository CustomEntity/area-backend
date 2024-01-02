/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-25
 **/
import { z } from 'zod';
import {
  ConnectionCredentialsSchema,
  EventDataSchema,
  TriggerDataSchema,
} from '../ports/event.service';

export abstract class EventApplicationService {
  abstract retrieveNewEventsData(
    eventTriggerData: z.infer<typeof TriggerDataSchema>,
    eventConnectionCredentials: z.infer<typeof ConnectionCredentialsSchema>,
  ): Promise<z.infer<typeof EventDataSchema>[]>;

  abstract getEventName(): string;
}
