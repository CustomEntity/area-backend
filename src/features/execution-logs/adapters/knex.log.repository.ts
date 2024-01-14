/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { LogRepository } from '../ports/log.repository';
import { Injectable } from '@nestjs/common';
import { Nullable } from '../../../shared/nullable';
import { Log } from '../entities/log.entity';
import { Knex } from 'knex';
import { Mapper } from '../../../shared/mapper';
import { LogLevel } from '../value-objects/log-level';

const LOG_TABLE = 'logs';

@Injectable()
export class KnexLogRepository implements LogRepository {
  private readonly mapper: KnexLogMapper = new KnexLogMapper();

  constructor(private readonly connection: Knex) {}

  async delete(id: string): Promise<void> {
    await this.connection(LOG_TABLE).where('id', id).del();
  }

  async findById(id: string): Promise<Nullable<Log>> {
    const row = await this.connection<Log>(LOG_TABLE)
      .select()
      .where('id', id)
      .first();

    if (!row) {
      return null;
    }
    return this.mapper.toEntity(row);
  }

  async findByLogExecutionId(logExecutionId: string): Promise<Log[]> {
    const rows = await this.connection<Log>(LOG_TABLE)
      .select()
      .where('execution_log_id', logExecutionId);
    return rows.map((row) => this.mapper.toEntity(row));
  }

  async save(executionLog: Log): Promise<void> {
    await this.connection(LOG_TABLE)
      .insert(this.mapper.toPersistence(executionLog))
      .onConflict('id')
      .merge();
  }
}

class KnexLogMapper implements Mapper<Log> {
  toEntity(data: any): Log {
    return new Log({
      id: data.id,
      executionLogId: data.execution_log_id,
      logLevel: LogLevel.create(data.log_level),
      message: data.message,
      logDate: data.log_date,
    });
  }

  toPersistence(entity: Log): any {
    return {
      id: entity.id,
      execution_log_id: entity.executionLogId,
      log_level: entity.level.value,
      message: entity.message,
      log_date: entity.logDate,
    };
  }
}
