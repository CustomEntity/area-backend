/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-25
 **/
import {
  ConnectionCredentialsSchema,
  EventDataSchema,
  TriggerDataSchema,
} from '../events/ports/event.service';
import { z } from 'zod';
import { ApplicationEventService } from '../events/decorators/application-event-service.decorator';
import { ApplicationEvent } from '../events/decorators/application-event.decorator';

@ApplicationEventService('github')
export class GithubApplicationEventService {

  @ApplicationEvent('New commit')
  async checkIfNewCommitOccurred(
    eventTriggerData: z.infer<typeof TriggerDataSchema>,
    eventConnectionCredentials: z.infer<typeof ConnectionCredentialsSchema>,
  ): Promise<z.infer<typeof EventDataSchema>[]> {
    console.log(
      'GithubApplicationEventService',
      eventTriggerData,
      eventConnectionCredentials,
    );
    return [];
  }
}
