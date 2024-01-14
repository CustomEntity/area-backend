/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { Nullable } from '../../../shared/nullable';
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { LogQueryRepository } from '../ports/log.query-repository';
import { GetExecutionLogLogsResult } from '../queries/get-execution-log-logs/get-execution-log-logs.result';
import {LogLevel} from "../value-objects/log-level";

const EXECUTION_LOG_TABLE = 'execution_logs';
const LOG_TABLE = 'logs';

@Injectable()
export class KnexLogQueryRepository implements LogQueryRepository {
  constructor(private readonly connection: Knex) {}

  async getLogsByExecutionLogId(
    executionLogId: string,
    take: number,
    skip: number,
  ): Promise<Nullable<GetExecutionLogLogsResult>> {
    const rows = await this.connection(EXECUTION_LOG_TABLE)
      .leftJoin(
        LOG_TABLE,
        `${EXECUTION_LOG_TABLE}.id`,
        '=',
        `${LOG_TABLE}.execution_log_id`,
      )
      .limit(take)
      .offset(skip)
      .select(`${LOG_TABLE}.*`)
      .where(`${EXECUTION_LOG_TABLE}.id`, executionLogId)
      .orderBy(`${LOG_TABLE}.id`, 'desc');

    if (!rows || rows.length === 0) {
      return null;
    }

    if (rows.length === 1 && !rows[0].id) {
      return { result: { logs: [], count: 0 } };
    }

    const logs = rows.map((row) => ({
      id: row.id,
      executionLogId: row.execution_log_id,
      logLevel: LogLevel.create(row.log_level).toString(),
      message: row.message,
      logDate: row.log_date,
    }));

    const countResult = await this.connection(LOG_TABLE)
      .where(`${LOG_TABLE}.execution_log_id`, executionLogId)
      .count(`${LOG_TABLE}.id as total`)
      .first();

    const count = parseInt((countResult?.total ?? '0').toString(), 10);

    return {
      result: {
        logs,
        count,
      },
    };
  }
}
