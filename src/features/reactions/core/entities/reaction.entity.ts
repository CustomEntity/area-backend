/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-30
 **/
import { Entity } from '../../../../shared/entity';
import { ActionMapping } from '../value-objects/action-mapping.vo';

export type ReactionData = {
  id: string;
  applicationId: string;
  name: string;
  description: string;
  actionMapping: ActionMapping;
  createdAt: Date;
};

export class Reaction extends Entity<ReactionData> {
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

  get actionMapping(): ActionMapping {
    return this.data.actionMapping;
  }

  get createdAt(): Date {
    return this.data.createdAt;
  }
}
