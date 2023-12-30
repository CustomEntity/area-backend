/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { ConnectionCredentials } from '../value-objects/connection-credentials.vo';
import { Entity } from '../../../shared/entity';

export type UserConnectionData = {
  id: string;
  userId: string;
  applicationId: string;
  name: string;
  connectionCredentials: ConnectionCredentials;
  createdAt: Date;
};

export class UserConnection extends Entity<UserConnectionData> {
  get id(): string {
    return this.data.id;
  }

  get userId(): string {
    return this.data.userId;
  }

  get applicationId(): string {
    return this.data.applicationId;
  }

  get name(): string {
    return this.data.name;
  }

  set name(name: string) {
    this.data.name = name;
  }

  get connectionCredentials(): ConnectionCredentials {
    return this.data.connectionCredentials;
  }

  get createdAt(): Date {
    return this.data.createdAt;
  }
}
