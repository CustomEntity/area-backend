/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-02
 **/

import { Injectable } from '@nestjs/common';
import { ApplicationEventQueryRepository } from '../ports/application-event.query-repository';
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
    const results = await this.connection(APPLICATION_TABLE)
      .leftJoin(
        APPLICATION_EVENT_TABLE,
        `${APPLICATION_TABLE}.id`,
        '=',
        `${APPLICATION_EVENT_TABLE}.application_id`,
      )
      .select(
        `${APPLICATION_TABLE}.id as application_id`,
        `${APPLICATION_EVENT_TABLE}.id`,
        `${APPLICATION_EVENT_TABLE}.name`,
        `${APPLICATION_EVENT_TABLE}.description`,
        `${APPLICATION_EVENT_TABLE}.notification_method`,
        `${APPLICATION_EVENT_TABLE}.notification_parameters`,
        `${APPLICATION_EVENT_TABLE}.trigger_mapping`,
        `${APPLICATION_EVENT_TABLE}.created_at`,
      )
      .where(`${APPLICATION_TABLE}.id`, applicationId);

    if (!results || results.length === 0 || !results[0].application_id) {
      return {
        events: undefined,
      };
    }

    const events = results.filter((result) => result.id != null);

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
