/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-25
 **/
import {
  ConnectionCredentialsSchema,
  EventDataSchema,
  EventService,
  TriggerDataSchema,
} from '../ports/event.service';
import { z } from 'zod';
import { EventApplicationService } from '../interfaces/event-application-service';
import githubEventApplicationServices from '../../github';
import { Injectable } from '@nestjs/common';

const services = new Map<string, EventApplicationService[]>();
services.set('github', githubEventApplicationServices);

@Injectable()
export class ConcreteEventService implements EventService {
  constructor() {}

  private getEventApplicationService(
    applicationName: string,
    eventName: string,
  ): EventApplicationService {
    const eventApplicationServices = services.get(applicationName);

    if (!eventApplicationServices) {
      throw new Error(
        `Event application services for application ${applicationName} not found`,
      );
    }
    const eventApplicationService = eventApplicationServices.find(
      (service) => service.getEventName() === eventName,
    );
    if (!eventApplicationService) {
      throw new Error(
        `Event application service for application ${applicationName} and event ${eventName} not found`,
      );
    }
    return eventApplicationService;
  }

  retrieveNewEventsData(
    applicationName: string,
    eventName: string,
    eventTriggerData: z.infer<typeof TriggerDataSchema>,
    eventConnectionCredentials: z.infer<typeof ConnectionCredentialsSchema>,
  ): Promise<z.infer<typeof EventDataSchema>[]> {
    const eventApplicationService = this.getEventApplicationService(
      applicationName,
      eventName,
    );
    return eventApplicationService.retrieveNewEventsData(
      eventTriggerData,
      eventConnectionCredentials,
    );
  }
}
