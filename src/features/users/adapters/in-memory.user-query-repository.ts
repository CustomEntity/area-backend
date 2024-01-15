import { FindUserByEmailResult } from '../queries/find-user-by-email/find-user-by-email.result';
import { Nullable } from '../../../shared/nullable';
import { UserQueryRepository } from '../ports/user.query-repository';
import { FindUserByIdResult } from '../queries/find-user-by-id/find-user-by-id.result';
import { GetUsersResult } from '../queries/get-users/get-users.result';
import { User } from '../entities/user.entity';
import { Email } from '../../../shared/value-objects/email.vo';

export class InMemoryUserQueryRepository implements UserQueryRepository {
  private users: User[] = [];

  constructor(users: User[] = []) {
    this.users = users;
  }

  async findByEmail(email: string): Promise<Nullable<FindUserByEmailResult>> {
    const user = this.users.find((user) =>
      user.email.equals(Email.create(email)),
    );
    if (!user) return null;
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email.value,
      profilePictureUrl: user.profilePictureUrl,
      createdAt: user.createdAt,
    };
  }

  async findById(id: string): Promise<Nullable<FindUserByIdResult>> {
    const user = this.users.find((user) => user.id === id);
    if (!user) return null;
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email.value,
      profilePictureUrl: user.profilePictureUrl,
      createdAt: user.createdAt,
    };
  }

  async findAndCount(take: number, skip: number): Promise<GetUsersResult> {
    const users = this.users.slice(skip, skip + take);
    return {
      users: users.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email.value,
        profilePictureUrl: user.profilePictureUrl,
        createdAt: user.createdAt,
      })),
      count: this.users.length,
    };
  }
}
