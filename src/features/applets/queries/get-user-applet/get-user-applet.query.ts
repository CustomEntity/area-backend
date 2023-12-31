/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-31
 **/
import { IQuery } from '@nestjs/cqrs';

export class GetUserAppletQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly appletId: string,
  ) {}
}
