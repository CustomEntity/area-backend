/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserConnectionsQuery } from './get-user-connections.query';
import { UserConnectionQueryRepository } from '../../ports/user-connection.query-repository';
import { GetUserConnectionsResult } from './get-user-connections.result';

@QueryHandler(GetUserConnectionsQuery)
export class GetUserConnectionsHandler
  implements IQueryHandler<GetUserConnectionsQuery, GetUserConnectionsResult>
{
  constructor(
    private readonly userConnectionQueryRepository: UserConnectionQueryRepository,
  ) {}

  async execute(
    query: GetUserConnectionsQuery,
  ): Promise<GetUserConnectionsResult> {
    const userConnections =
      await this.userConnectionQueryRepository.getUserConnections(query.userId);

    return userConnections;
  }
}
