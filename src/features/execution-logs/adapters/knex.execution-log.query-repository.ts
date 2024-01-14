/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { ExecutionLogQueryRepository } from '../ports/execution-log.query-repository';
import { Nullable } from '../../../shared/nullable';
import { GetExecutionLogsByUserResult } from '../queries/get-execution-logs-by-user/get-execution-logs-by-user.result';
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';

const EXECUTION_LOG_TABLE = 'execution_logs';
const USER_TABLE = 'users';
const APPLET_TABLE = 'applets';

@Injectable()
export class KnexExecutionLogQueryRepository
  implements ExecutionLogQueryRepository
{
  constructor(private readonly connection: Knex) {}

  async getExecutionLogsByUser(
    userId: string,
    take: number,
    skip: number,
  ): Promise<Nullable<GetExecutionLogsByUserResult>> {
    const rows = await this.connection(USER_TABLE)
      .leftJoin(
        APPLET_TABLE,
        `${USER_TABLE}.id`,
        '=',
        `${APPLET_TABLE}.user_id`,
      )
      .leftJoin(
        EXECUTION_LOG_TABLE,
        `${APPLET_TABLE}.id`,
        '=',
        `${EXECUTION_LOG_TABLE}.applet_id`,
      )
      .limit(take)
      .offset(skip)
      .select(`${EXECUTION_LOG_TABLE}.*`, `${USER_TABLE}.id as userExists`)
      .where(`${USER_TABLE}.id`, userId)
      .orderBy(`${EXECUTION_LOG_TABLE}.id`, 'desc');

    if (!rows || rows.length === 0) {
      return null;
    }

    if (rows.length === 1 && !rows[0].id) {
      return { result: { executionLogs: [], count: 0 } };
    }

    const executionLogs = rows.map((row) => ({
      id: row.id,
      summary: row.summary,
      executionDate: row.execution_date,
      appletId: row.applet_id,
    }));

    const countResult = await this.connection(EXECUTION_LOG_TABLE)
      .join(
        APPLET_TABLE,
        `${EXECUTION_LOG_TABLE}.applet_id`,
        '=',
        `${APPLET_TABLE}.id`,
      )
      .where(`${APPLET_TABLE}.user_id`, userId)
      .count(`${EXECUTION_LOG_TABLE}.id as total`)
      .first();

    const count = parseInt((countResult?.total ?? '0').toString(), 10);

    return {
      result: {
        executionLogs,
        count,
      },
    };
  }
}
