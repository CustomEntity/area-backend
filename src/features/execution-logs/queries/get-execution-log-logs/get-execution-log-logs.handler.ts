/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Nullable } from '../../../../shared/nullable';
import { GetExecutionLogLogsResult } from './get-execution-log-logs.result';
import { DomainError } from '../../../../shared/domain-error';
import { GetExecutionLogLogsQuery } from './get-execution-log-logs.query';
import { LogQueryRepository } from '../../ports/log.query-repository';

const MAX_LIMIT = 20;

@QueryHandler(GetExecutionLogLogsQuery)
export class GetExecutionLogLogsHandler
  implements
    IQueryHandler<
      GetExecutionLogLogsQuery,
      Nullable<GetExecutionLogLogsResult>
    >
{
  constructor(private readonly logQueryRepository: LogQueryRepository) {}

  async execute(
    query: GetExecutionLogLogsQuery,
  ): Promise<Nullable<GetExecutionLogLogsResult>> {
    const { page, limit } = query;
    const adjustedLimit = Math.min(limit, MAX_LIMIT);

    const result = await this.logQueryRepository.getLogsByExecutionLogId(
      query.executionLogId,
      adjustedLimit,
      (page - 1) * adjustedLimit,
    );

    if (!result) {
      throw new DomainError(
        'NotFound',
        'EXECUTION_LOG_NOT_FOUND',
        `Execution log with id ${query.executionLogId} not found`,
      );
    }

    return result;
  }
}
