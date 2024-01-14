/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { GetExecutionLogsByUserResult } from '../queries/get-execution-logs-by-user/get-execution-logs-by-user.result';
import { Nullable } from '../../../shared/nullable';

export const EXECUTION_LOG_QUERY_REPOSITORY = Symbol(
  'EXECUTION_LOG_QUERY_REPOSITORY',
);

export interface ExecutionLogQueryRepository {
  getExecutionLogsByUser(
    userId: string,
    take: number,
    skip: number,
  ): Promise<Nullable<GetExecutionLogsByUserResult>>;
}
