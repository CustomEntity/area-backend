/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { UserConnection } from '../entities/user-connection.entity';
import { Nullable } from '../../../shared/nullable';

export const USER_CONNECTION_REPOSITORY = Symbol('USER_CONNECTION_REPOSITORY');

export interface UserConnectionRepository {
  findById(id: string): Promise<Nullable<UserConnection>>;

  findByUserId(userId: string): Promise<UserConnection[]>;

  findByApplicationId(applicationId: string): Promise<UserConnection[]>;

  save(userConnection: UserConnection): Promise<void>;

  delete(userConnection: UserConnection): Promise<void>;
}
