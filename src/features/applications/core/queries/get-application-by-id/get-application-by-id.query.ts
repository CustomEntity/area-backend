/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-01
 **/
import { IQuery } from '@nestjs/cqrs';

export class GetApplicationByIdQuery implements IQuery {
  constructor(public readonly applicationId: string) {}
}
