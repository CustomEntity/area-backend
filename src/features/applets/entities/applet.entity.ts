/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/
import { TriggerData } from '../value-objects/trigger-data.vo';
import { ReactionActionData } from '../value-objects/reaction-action-data.vo';
import { Entity } from '../../../shared/entity';
import { Event } from '../value-objects/event.vo';
import { UserConnection } from '../value-objects/user-connection.vo';
import { Reaction } from '../value-objects/reaction.vo';

export type AppletData = {
  id: string;
  userId: string;
  eventId: string;
  event: Event;
  eventTriggerData?: TriggerData;
  eventConnectionId?: string;
  eventConnection?: UserConnection;
  reactionId: string;
  reaction: Reaction;
  reactionActionData?: ReactionActionData;
  reactionConnectionId?: string;
  reactionConnection?: UserConnection;
  name: string;
  description: string;
  active: boolean;
  createdAt: Date;
};

export class Applet extends Entity<AppletData> {
  get id(): string {
    return this.data.id;
  }

  get userId(): string {
    return this.data.userId;
  }

  get eventId(): string {
    return this.data.eventId;
  }

  get event(): Event {
    return this.data.event;
  }

  get eventTriggerData(): TriggerData | undefined {
    return this.data.eventTriggerData;
  }

  get eventConnectionId(): string | undefined {
    return this.data.eventConnectionId;
  }

  get eventConnection(): UserConnection | undefined {
    return this.data.eventConnection;
  }

  get reactionId(): string {
    return this.data.reactionId;
  }

  get reaction(): Reaction {
    return this.data.reaction;
  }

  get reactionActionData(): ReactionActionData | undefined {
    return this.data.reactionActionData;
  }

  get reactionConnectionId(): string | undefined {
    return this.data.reactionConnectionId;
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

  removeUserConnection(userConnectionId: string): void {
    if (this.eventConnectionId === userConnectionId) {
      this.data.eventConnectionId = undefined;
      this.data.eventConnection = undefined;
    }

    if (this.reactionConnectionId === userConnectionId) {
      this.data.reactionConnectionId = undefined;
      this.data.reactionConnection = undefined;
    }
  }
}
