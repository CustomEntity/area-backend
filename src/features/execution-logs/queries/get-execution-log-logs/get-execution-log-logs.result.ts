/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/

import { IQueryResult } from '@nestjs/cqrs';

export class GetExecutionLogLogsResult implements IQueryResult {
  readonly logs: {
    id: string;
    executionLogId: string;
    logLevel: string;
    message: string;
    logDate: Date;
  }[];
  readonly count: number;
}
