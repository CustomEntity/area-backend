/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { IQuery } from '@nestjs/cqrs';

export class GetUserConnectionQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly connectionId: string,
  ) {}
}
