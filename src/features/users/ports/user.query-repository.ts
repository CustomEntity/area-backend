/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Nullable } from '../../../shared/nullable';
import { FindUserByIdResult } from '../queries/find-user-by-id/find-user-by-id.result';
import { FindUserByEmailResult } from '../queries/find-user-by-email/find-user-by-email.result';
import { GetUsersResult } from '../queries/get-users/get-users.result';

export const USER_QUERY_REPOSITORY = Symbol('USER_QUERY_REPOSITORY');

export interface UserQueryRepository {
  findById(id: string): Promise<Nullable<FindUserByIdResult>>;

  findByEmail(email: string): Promise<Nullable<FindUserByEmailResult>>;

  findAndCount(take: number, skip: number): Promise<GetUsersResult>;
}
