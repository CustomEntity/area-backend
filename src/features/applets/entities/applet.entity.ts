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
  reactionParametersData?: ReactionParametersData;
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

  set eventId(eventId: string) {
    this.data.eventId = eventId;
  }

  get eventTriggerData(): TriggerData | undefined {
    return this.data.eventTriggerData;
  }

  set eventTriggerData(eventTriggerData: TriggerData) {
    this.data.eventTriggerData = eventTriggerData;
  }

  get eventConnectionId(): string | undefined {
    return this.data.eventConnectionId;
  }

  set eventConnectionId(eventConnectionId: string | undefined) {
    this.data.eventConnectionId = eventConnectionId;
  }

  get reactionId(): string {
    return this.data.reactionId;
  }

  set reactionId(reactionId: string) {
    this.data.reactionId = reactionId;
  }

  get reactionParametersData(): ReactionParametersData | undefined {
    return this.data.reactionParametersData;
  }

  set reactionParametersData(reactionParametersData: ReactionParametersData) {
    this.data.reactionParametersData = reactionParametersData;
  }

  get reactionConnectionId(): string | undefined {
    return this.data.reactionConnectionId;
  }

  set reactionConnectionId(reactionConnectionId: string | undefined) {
    this.data.reactionConnectionId = reactionConnectionId;
  }

  get name(): string {
    return this.data.name;
  }

  set name(name: string) {
    this.data.name = name;
  }

  get description(): string {
    return this.data.description;
  }

  set description(description: string) {
    this.data.description = description;
  }

  get active(): boolean {
    return this.data.active;
  }

  set active(active: boolean) {
    this.data.active = active;
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
