/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetExecutionLogsByUserQuery } from './get-execution-logs-by-user.query';
import { Nullable } from '../../../../shared/nullable';
import { GetExecutionLogsByUserResult } from './get-execution-logs-by-user.result';
import { ExecutionLogQueryRepository } from '../../ports/execution-log.query-repository';
import { DomainError } from '../../../../shared/domain-error';

const MAX_LIMIT = 20;

@QueryHandler(GetExecutionLogsByUserQuery)
export class GetExecutionLogsByUserHandler
  implements
    IQueryHandler<
      GetExecutionLogsByUserQuery,
      Nullable<GetExecutionLogsByUserResult>
    >
{
  constructor(
    private readonly executionLogQueryRepository: ExecutionLogQueryRepository,
  ) {}

  async execute(
    query: GetExecutionLogsByUserQuery,
  ): Promise<Nullable<GetExecutionLogsByUserResult>> {
    const { page, limit } = query;
    const adjustedLimit = Math.min(limit, MAX_LIMIT);

    const result =
      await this.executionLogQueryRepository.getExecutionLogsByUser(
        query.userId,
        adjustedLimit,
        (page - 1) * adjustedLimit,
      );

    if (!result) {
      throw new DomainError(
        'NotFound',
        'USER_NOT_FOUND',
        `User with id ${query.userId} not found`,
      );
    }

    return result;
  }
}
