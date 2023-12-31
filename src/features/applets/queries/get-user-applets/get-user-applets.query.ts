/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-31
 **/
import { IQuery } from '@nestjs/cqrs';

export class GetUserAppletsQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
