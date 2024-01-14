/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { Injectable } from '@nestjs/common';
import { ExecutionLogRepository } from '../ports/execution-log.repository';
import { Knex } from 'knex';
import { ExecutionLog } from '../entities/execution-log.entity';
import { Mapper } from '../../../shared/mapper';
import { undefined } from 'zod';
import { Nullable } from '../../../shared/nullable';

const EXECUTION_LOG_TABLE = 'execution_logs';

@Injectable()
export class KnexExecutionLogRepository implements ExecutionLogRepository {
  private readonly mapper: KnexExecutionLogMapper =
    new KnexExecutionLogMapper();

  constructor(private readonly connection: Knex) {}

  async delete(id: string): Promise<void> {
    await this.connection(EXECUTION_LOG_TABLE).where('id', id).del();
  }

  async findAllByAppletId(appletId: string): Promise<ExecutionLog[]> {
    const rows = await this.connection<ExecutionLog>(EXECUTION_LOG_TABLE)
      .select()
      .where('applet_id', appletId);
    return rows.map((row) => this.mapper.toEntity(row));
  }

  async findAllByUserIdOrderByIdDesc(userId: string): Promise<ExecutionLog[]> {
    const rows = await this.connection<ExecutionLog>(EXECUTION_LOG_TABLE)
      .select()
      .where('user_id', userId)
      .orderBy('id', 'desc');
    return rows.map((row) => this.mapper.toEntity(row));
  }

  async findById(id: string): Promise<Nullable<ExecutionLog>> {
    const row = await this.connection<ExecutionLog>(EXECUTION_LOG_TABLE)
      .select()
      .where('id', id)
      .first();

    if (!row) {
      return null;
    }
    return this.mapper.toEntity(row);
  }

  async save(executionLog: ExecutionLog): Promise<void> {
    await this.connection(EXECUTION_LOG_TABLE)
      .insert(this.mapper.toPersistence(executionLog))
      .onConflict('id')
      .merge();
  }
}

class KnexExecutionLogMapper extends Mapper<ExecutionLog> {
  toEntity(data: any): ExecutionLog {
    return new ExecutionLog({
      id: data.id,
      appletId: data.applet_id,
      summary: data.summary,
      executionDate: data.execution_date,
    });
  }

  toPersistence(entity: ExecutionLog): any {
    return {
      id: entity.id,
      applet_id: entity.appletId,
      summary: entity.summary,
      execution_date: entity.executionDate,
    };
  }
}
