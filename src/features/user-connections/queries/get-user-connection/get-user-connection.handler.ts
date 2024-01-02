/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserConnectionQuery } from './get-user-connections.query';
import { UserConnectionQueryRepository } from '../../ports/user-connection.query-repository';
import { GetUserConnectionResult } from './get-user-connection.result';
import { DomainError } from '../../../../shared/domain-error';

@QueryHandler(GetUserConnectionQuery)
export class GetUserConnectionHandler
  implements IQueryHandler<GetUserConnectionQuery, GetUserConnectionResult>
{
  constructor(
    private readonly userConnectionQueryRepository: UserConnectionQueryRepository,
  ) {}

  async execute(
    query: GetUserConnectionQuery,
  ): Promise<GetUserConnectionResult> {
    const userConnections =
      await this.userConnectionQueryRepository.getUserConnection(
        query.connectionId,
      );

    if (!userConnections) {
      throw new DomainError(
        'NotFound',
        'USER_CONNECTION_NOT_FOUND',
        `User connection with id '${query.connectionId}' not found`,
      );
    }

    return userConnections;
  }
}
