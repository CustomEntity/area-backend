/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { ExecutionLog } from '../entities/execution-log.entity';
import { Nullable } from '../../../shared/nullable';

export const EXECUTION_LOG_REPOSITORY = Symbol('EXECUTION_LOG_REPOSITORY');

export interface ExecutionLogRepository {
  findById(id: string): Promise<Nullable<ExecutionLog>>;

  findAllByAppletId(appletId: string): Promise<ExecutionLog[]>;

  findAllByUserIdOrderByIdDesc(userId: string): Promise<ExecutionLog[]>;

  save(executionLog: ExecutionLog): Promise<void>;

  delete(id: string): Promise<void>;
}
