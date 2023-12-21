/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { User } from '../entities/user.entity';
import { UserRepository } from '../ports/user.repository';
import { Nullable } from '../../../shared/nullable';

export class InMemoryUserRepository implements UserRepository {
  constructor(private readonly users: User[]) {}

  public async save(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
      return;
    }

    this.users.push(user);
  }

  public async findById(id: string): Promise<Nullable<User>> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  public async findByEmail(email: string): Promise<Nullable<User>> {
    return this.users.find((user) => user.email.value === email) ?? null;
  }

  findAll(): Promise<User[]> {
    return Promise.resolve(this.users);
  }
}
