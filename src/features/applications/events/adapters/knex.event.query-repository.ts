/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-02
 **/

import { Injectable } from '@nestjs/common';
import { ApplicationEventQueryRepository } from '../ports/event.query-repository';
import { GetApplicationEventsResult } from '../queries/get-application-events.result';
import { Knex } from 'knex';

const APPLICATION_TABLE = 'applications';
const APPLICATION_EVENT_TABLE = 'application_events';

@Injectable()
export class KnexApplicationEventQueryRepository
  implements ApplicationEventQueryRepository
{
  constructor(private readonly connection: Knex) {}

  async findEventsByApplicationId(
    applicationId: string,
  ): Promise<GetApplicationEventsResult> {
    const application = await this.connection(APPLICATION_TABLE)
      .select()
      .where('id', applicationId)
      .first();

    if (!application) {
      return {
        events: undefined,
      };
    }
    const events = await this.connection(APPLICATION_EVENT_TABLE)
      .select()
      .where('application_id', applicationId);

    return {
      events: events.map((event) => ({
        id: event.id,
        applicationId: event.application_id,
        name: event.name,
        description: event.description,
        notificationMethod: event.notification_method,
        notificationParameters: event.notification_parameters,
        triggerMapping: event.trigger_mapping,
        createdAt: event.created_at,
      })),
    };
  }
}
