/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { Nullable } from '../../../shared/nullable';
import { GetExecutionLogLogsResult } from '../queries/get-execution-log-logs/get-execution-log-logs.result';

export const LOG_QUERY_REPOSITORY = Symbol('LOG_QUERY_REPOSITORY');

export interface LogQueryRepository {
  getLogsByExecutionLogId(
    executionLogId: string,
    take: number,
    skip: number,
  ): Promise<Nullable<GetExecutionLogLogsResult>>;
}
