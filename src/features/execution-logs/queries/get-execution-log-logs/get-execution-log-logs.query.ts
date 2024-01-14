/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { IQuery } from '@nestjs/cqrs';

export class GetExecutionLogLogsQuery implements IQuery {
  constructor(
    readonly executionLogId: string,
    readonly page: number,
    readonly limit: number,
  ) {}
}
