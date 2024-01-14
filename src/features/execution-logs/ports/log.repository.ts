/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { Log } from '../entities/log.entity';
import { Nullable } from '../../../shared/nullable';

export const LOG_REPOSITORY = Symbol('LOG_REPOSITORY')

export interface LogRepository {
  findById(id: string): Promise<Nullable<Log>>;

  findByLogExecutionId(logExecutionId: string): Promise<Log[]>;

  save(executionLog: Log): Promise<void>;

  delete(id: string): Promise<void>;
}
