/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { IQueryResult } from '@nestjs/cqrs';

export class FindUserByIdResult implements IQueryResult {
  readonly id: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email: string;
  readonly profilePictureUrl?: string;
  readonly createdAt: Date;
}
