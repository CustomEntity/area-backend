/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-13
 **/
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { GetUsersQuery } from './get-users.query';
import { GetUsersResult } from './get-users.result';
import { UserQueryRepository } from '../../ports/user.query-repository';

const MAX_LIMIT = 20;

@QueryHandler(GetUsersQuery)
export class GetUsersHandler
  implements IQueryHandler<GetUsersQuery, GetUsersResult>
{
  constructor(private readonly userQueryRepository: UserQueryRepository) {}

  async execute(query: GetUsersQuery): Promise<GetUsersResult> {
    const { page, limit } = query;
    const adjustedLimit = Math.min(limit, MAX_LIMIT);

    return await this.userQueryRepository.findAndCount(
      adjustedLimit,
      (page - 1) * adjustedLimit,
    );
  }
}
