/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/

import { IQuery, IQueryResult } from '@nestjs/cqrs';

export class GetExecutionLogsByUserResult implements IQueryResult {
  readonly executionLogs: {
    id: string;
    appletId: string;
    summary: string;
    executionDate: Date;
  }[];
  readonly count: number;
}
