import { UserRepository } from '../ports/user.repository';
import { User } from '../entities/user.entity';
import { Nullable } from '../../../shared/nullable';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  constructor(users: User[] = []) {
    this.users = users;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findByEmail(email: string): Promise<Nullable<User>> {
    return this.users.find((user) => user.data.email.value === email) || null;
  }

  async findById(id: string): Promise<Nullable<User>> {
    return this.users.find((user) => user.data.id === id) || null;
  }

  async save(user: User): Promise<void> {
    const existingUserIndex = this.users.findIndex(
      (u) => u.data.id === user.data.id,
    );
    if (existingUserIndex !== -1) {
      this.users[existingUserIndex] = user;
    } else {
      this.users.push(user);
    }
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.data.id !== id);
  }
}
