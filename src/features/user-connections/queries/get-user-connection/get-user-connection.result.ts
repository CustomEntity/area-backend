/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-02
 **/

import { IQueryResult } from '@nestjs/cqrs';

export class GetUserConnectionResult implements IQueryResult {
  readonly connection?: {
    id: string;
    userId: string;
    applicationId: string;
    name: string;
    createdAt: Date;
  };
}
