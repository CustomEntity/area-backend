/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Nullable } from '../../../shared/nullable';
import { UserQueryRepository } from '../ports/user.query-repository';
import { FindUserByIdResult } from '../queries/find-user-by-id/find-user-by-id.result';
import { User } from '../entities/user.entity';
import { FindUserByEmailResult } from '../queries/find-user-by-email/find-user-by-email.result';

export class InMemoryUserQueryRepository implements UserQueryRepository {
  constructor(private readonly users: User[]) {}

  async findById(id: string): Promise<Nullable<FindUserByIdResult>> {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email.value,
      profilePictureUrl: user.profilePictureUrl,
      createdAt: user.createdAt,
    };
  }

  async findByEmail(email: string): Promise<Nullable<FindUserByEmailResult>> {
    const user = this.users.find((user) => user.email.value === email);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email.value,
      profilePictureUrl: user.profilePictureUrl,
      createdAt: user.createdAt,
    };
  }
}
