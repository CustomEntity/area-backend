/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Injectable } from '@nestjs/common';
import { UserConnectionRepository } from '../ports/user-connection.repository';
import { Nullable } from '../../../shared/nullable';
import { UserConnection } from '../entities/user-connection.entity';
import { Mapper } from '../../../shared/mapper';
import { ConnectionCredentials } from '../value-objects/connection-credentials.vo';
import { Knex } from 'knex';

const USER_CONNECTION_TABLE = 'user_connections';

@Injectable()
export class KnexUserConnectionRepository implements UserConnectionRepository {
  private readonly mapper: KnexUserConnectionMapper =
    new KnexUserConnectionMapper();

  constructor(private readonly connection: Knex) {}

  async save(userConnection: UserConnection): Promise<void> {
    await this.connection(USER_CONNECTION_TABLE)
      .insert(this.mapper.toPersistence(userConnection))
      .onConflict('id')
      .merge();
  }

  async findByApplicationId(applicationId: string): Promise<UserConnection[]> {
    const userConnections = await this.connection(USER_CONNECTION_TABLE)
      .select()
      .where('application_id', applicationId);

    return userConnections.map((userConnection) =>
      this.mapper.toEntity(userConnection),
    );
  }

  async findById(id: string): Promise<Nullable<UserConnection>> {
    const userConnection = await this.connection(USER_CONNECTION_TABLE)
      .select()
      .where('id', id)
      .first();

    if (userConnection == null) {
      return null;
    }

    return this.mapper.toEntity(userConnection);
  }

  async findByUserId(userId: string): Promise<UserConnection[]> {
    const userConnections = await this.connection(USER_CONNECTION_TABLE)
      .select()
      .where('user_id', userId);

    return userConnections.map((userConnection) =>
      this.mapper.toEntity(userConnection),
    );
  }

  async delete(userConnection: UserConnection): Promise<void> {
    await this.connection(USER_CONNECTION_TABLE)
      .where('id', userConnection.id)
      .del();
  }
}

class KnexUserConnectionMapper extends Mapper<UserConnection> {
  toEntity(data: any): UserConnection {
    return new UserConnection({
      id: data.id,
      userId: data.user_id,
      applicationId: data.application_id,
      name: data.name,
      connectionCredentials: ConnectionCredentials.create(
        data.connection_credentials,
      ),
      createdAt: data.created_at,
    });
  }

  toPersistence(data: UserConnection): any {
    return {
      id: data.id,
      user_id: data.userId,
      application_id: data.applicationId,
      name: data.name,
      connection_credentials: data.connectionCredentials.value,
      created_at: data.createdAt,
    };
  }
}
