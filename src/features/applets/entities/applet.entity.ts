/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/
import { TriggerData } from '../value-objects/trigger-data.vo';
import { ReactionParametersData } from '../value-objects/reaction-parameters-data.vo';
import { Entity } from '../../../shared/entity';

export type AppletData = {
  id: string;
  userId: string;
  eventId: string;
  eventTriggerData?: TriggerData;
  eventConnectionId?: string;
  reactionId: string;
  reactionActionData?: ReactionParametersData;
  reactionConnectionId?: string;
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

  get eventTriggerData(): TriggerData | undefined {
    return this.data.eventTriggerData;
  }

  get eventConnectionId(): string | undefined {
    return this.data.eventConnectionId;
  }

  get reactionId(): string {
    return this.data.reactionId;
  }

  get reactionActionData(): ReactionParametersData | undefined {
    return this.data.reactionActionData;
  }

  get reactionConnectionId(): string | undefined {
    return this.data.reactionConnectionId;
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
    }

    if (this.reactionConnectionId === userConnectionId) {
      this.data.reactionConnectionId = undefined;
    }
  }
}
