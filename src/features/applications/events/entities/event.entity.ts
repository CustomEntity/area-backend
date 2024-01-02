/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/
import { Entity } from 'src/shared/entity';
import { TriggerMapping } from '../value-objects/trigger-mapping.vo';
import { NotificationParameters } from '../value-objects/notification-parameters.vo';
import { NotificationMethod } from '../value-objects/notification-method.vo';

export type EventData = {
  id: string;
  applicationId: string;
  name: string;
  description: string;
  notificationMethod: NotificationMethod;
  notificationParameters: NotificationParameters;
  triggerMapping: TriggerMapping;
  createdAt: Date;
};

export class Event extends Entity<EventData> {
  get id(): string {
    return this.data.id;
  }

  get applicationId(): string {
    return this.data.applicationId;
  }

  get name(): string {
    return this.data.name;
  }

  get description(): string {
    return this.data.description;
  }

  get notificationMethod(): NotificationMethod {
    return this.data.notificationMethod;
  }

  get notificationParameters(): NotificationParameters {
    return this.data.notificationParameters;
  }

  get triggerMapping(): TriggerMapping {
    return this.data.triggerMapping;
  }

  get createdAt(): Date {
    return this.data.createdAt;
  }
}
