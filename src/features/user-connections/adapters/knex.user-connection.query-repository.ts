/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Injectable } from '@nestjs/common';
import { UserConnectionQueryRepository } from '../ports/user-connection.query-repository';
import { Knex } from 'knex';
import { GetUserConnectionsResult } from '../queries/get-user-connections/get-user-connections.result';

const USER_CONNECTION_TABLE = 'user_connections';

@Injectable()
export class KnexUserConnectionQueryRepository
  implements UserConnectionQueryRepository
{
  constructor(private readonly connection: Knex) {}

  async getUserConnections(userId: string): Promise<GetUserConnectionsResult> {
    const userConnections = await this.connection(USER_CONNECTION_TABLE)
      .select()
      .where('user_id', userId);

    return {
      connections: userConnections.map((userConnection) => {
        return {
          id: userConnection.id,
          userId: userConnection.user_id,
          applicationId: userConnection.application_id,
          name: userConnection.name,
          createdAt: userConnection.created_at,
        };
      }),
    };
  }
}
