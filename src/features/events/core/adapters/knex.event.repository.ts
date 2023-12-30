/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Injectable } from '@nestjs/common';
import { EventRepository } from '../ports/event.repository';
import { Knex } from 'knex';
import { Nullable } from '../../../../shared/nullable';
import { Mapper } from '../../../../shared/mapper';
import { NotificationParameters } from '../value-objects/notification-parameters.vo';
import { NotificationMethod } from '../value-objects/notification-method.vo';
import { TriggerMapping } from '../value-objects/trigger-mapping.vo';
import { Event } from '../entities/event.entity';

const EVENT_TABLE = 'application_events';

@Injectable()
export class KnexEventRepository implements EventRepository {
  private readonly mapper: KnexEventMapper = new KnexEventMapper();

  constructor(private readonly connection: Knex) {}

  async findById(id: string): Promise<Nullable<Event>> {
    const event = await this.connection(EVENT_TABLE)
      .select()
      .where('id', id)
      .first();

    if (!event) {
      return null;
    }

    return this.mapper.toEntity(event);
  }

  async findByApplicationId(applicationId: string): Promise<Event[]> {
    const events = await this.connection(EVENT_TABLE)
      .select()
      .where('application_id', applicationId);

    return events.map((event) => this.mapper.toEntity(event));
  }

  async findAll(): Promise<Event[]> {
    const events = await this.connection(EVENT_TABLE).select();

    return events.map((event) => this.mapper.toEntity(event));
  }
}

class KnexEventMapper extends Mapper<Event> {
  toEntity(data: any): Event {
    return new Event({
      id: data.id,
      applicationId: data.application_id,
      name: data.name,
      description: data.description,
      notificationMethod: NotificationMethod.create(data.notification_method),
      notificationParameters: NotificationParameters.create(
        data.notification_parameters,
      ),
      triggerMapping: TriggerMapping.create(data.trigger_mapping),
      createdAt: data.created_at,
    });
  }

  toPersistence(entity: Event): any {
    return {
      id: entity.id,
      application_id: entity.applicationId,
      name: entity.name,
      description: entity.description,
      notification_method: entity.notificationMethod.value,
      notification_parameters: entity.notificationParameters.value,
      trigger_mapping: entity.triggerMapping.value,
      created_at: entity.createdAt,
    };
  }
}
