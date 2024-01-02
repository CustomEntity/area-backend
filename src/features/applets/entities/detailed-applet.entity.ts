/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/
import { TriggerData } from '../value-objects/trigger-data.vo';
import { ReactionParametersData } from '../value-objects/reaction-parameters-data.vo';
import { Entity } from '../../../shared/entity';
import { Event } from '../value-objects/event.vo';
import { UserConnection } from '../value-objects/user-connection.vo';
import { Reaction } from '../value-objects/reaction.vo';

export type DetailedAppletData = {
  id: string;
  userId: string;
  event: Event;
  eventTriggerData?: TriggerData;
  eventConnection?: UserConnection;
  reaction: Reaction;
  reactionActionData?: ReactionParametersData;
  reactionConnection?: UserConnection;
  name: string;
  description: string;
  active: boolean;
  createdAt: Date;
};

export class DetailedApplet extends Entity<DetailedAppletData> {
  get id(): string {
    return this.data.id;
  }

  get userId(): string {
    return this.data.userId;
  }

  get event(): Event {
    return this.data.event;
  }

  get eventTriggerData(): TriggerData | undefined {
    return this.data.eventTriggerData;
  }

  get eventConnection(): UserConnection | undefined {
    return this.data.eventConnection;
  }

  get reaction(): Reaction {
    return this.data.reaction;
  }

  get reactionActionData(): ReactionParametersData | undefined {
    return this.data.reactionActionData;
  }

  get reactionConnection(): UserConnection | undefined {
    return this.data.reactionConnection;
  }

  get name(): string {
    return this.data.name;
  }

  get description(): string {
    return this.data.description;
  }

  get active(): boolean {
    return this.data.active;
  }

  get createdAt(): Date {
    return this.data.createdAt;
  }
}
