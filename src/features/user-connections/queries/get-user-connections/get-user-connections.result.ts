/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { IQueryResult } from '@nestjs/cqrs';
import { z } from 'zod';

export class GetUserConnectionsResult implements IQueryResult {
  readonly connections: {
    id: string;
    userId: string;
    applicationId: string;
    name: string;
    createdAt: Date;
  }[];
}
