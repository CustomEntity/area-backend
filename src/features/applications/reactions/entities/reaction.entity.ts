/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-30
 **/
import { Entity } from '../../../../shared/entity';
import { ParametersMapping } from '../value-objects/parameters-mapping.vo';

export type ReactionData = {
  id: string;
  applicationId: string;
  name: string;
  description: string;
  parametersMapping: ParametersMapping;
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

  get parametersMapping(): ParametersMapping {
    return this.data.parametersMapping;
  }

  get createdAt(): Date {
    return this.data.createdAt;
  }
}
