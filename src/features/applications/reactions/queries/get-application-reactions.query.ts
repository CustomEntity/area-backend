/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-02
 **/
import { IQuery } from '@nestjs/cqrs';

export class GetApplicationReactionsQuery implements IQuery {
  constructor(public readonly applicationId: string) {}
}
