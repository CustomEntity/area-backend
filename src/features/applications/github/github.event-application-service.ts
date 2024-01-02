/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-25
 **/
import { EventApplicationService } from '../events/interfaces/event-application-service';
import {
  ConnectionCredentialsSchema,
  EventDataSchema,
  TriggerDataSchema,
} from '../events/ports/event.service';
import { z } from 'zod';

export class NewCommitEventApplicationService extends EventApplicationService {
  retrieveNewEventsData(
    eventTriggerData: z.infer<typeof TriggerDataSchema>,
    eventConnectionCredentials: z.infer<typeof ConnectionCredentialsSchema>,
  ): Promise<z.infer<typeof EventDataSchema>[]> {
    console.log(
      'NewCommitEventApplicationService',
      eventTriggerData,
      eventConnectionCredentials,
    );
    return Promise.resolve([]);
  }

  getEventName(): string {
    return 'New commit';
  }
}
