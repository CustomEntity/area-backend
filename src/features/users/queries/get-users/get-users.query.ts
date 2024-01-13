/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-13
 **/
import { IQuery } from '@nestjs/cqrs';

export class GetUsersQuery implements IQuery {
  constructor(
    readonly page: number,
    readonly limit: number,
  ) {}
}
