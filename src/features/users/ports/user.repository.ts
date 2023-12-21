/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Nullable } from '../../../shared/nullable';
import { User } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  save(user: User): Promise<void>;

  findById(id: string): Promise<Nullable<User>>;

  findByEmail(email: string): Promise<Nullable<User>>;

  findAll(): Promise<User[]>;
}
