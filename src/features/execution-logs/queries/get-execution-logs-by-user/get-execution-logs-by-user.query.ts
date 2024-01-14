/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { IQuery } from '@nestjs/cqrs';

export class GetExecutionLogsByUserQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
