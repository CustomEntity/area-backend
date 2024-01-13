/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { IQueryResult } from '@nestjs/cqrs';

export class GetUsersResult implements IQueryResult {
  readonly users: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    profilePictureUrl?: string;
    createdAt: Date;
  }[];
  readonly count: number;
}
