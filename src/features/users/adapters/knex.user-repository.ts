/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Injectable } from '@nestjs/common';
import { UserRepository } from '../ports/user.repository';
import { Knex } from 'knex';
import { Nullable } from '../../../shared/nullable';
import { User } from '../entities/user.entity';
import { Mapper } from '../../../shared/mapper';
import { Email } from '../../../shared/value-objects/email.vo';

const USER_TABLE = 'users';

@Injectable()
export class KnexUserRepository implements UserRepository {
  private readonly mapper: KnexUserMapper = new KnexUserMapper();

  constructor(private readonly connection: Knex) {}

  async findAll(): Promise<User[]> {
    const users = await this.connection(USER_TABLE).select();

    return users.map((user) => this.mapper.toEntity(user));
  }

  async findByEmail(email: string): Promise<Nullable<User>> {
    const user = await this.connection(USER_TABLE)
      .select()
      .where('email', email)
      .first();

    if (user == null) {
      return null;
    }

    return this.mapper.toEntity(user);
  }

  async findById(id: string): Promise<Nullable<User>> {
    const user = await this.connection(USER_TABLE)
      .select()
      .where('id', id)
      .first();

    if (user == null) {
      return null;
    }

    return this.mapper.toEntity(user);
  }

  async save(user: User): Promise<void> {
    await this.connection(USER_TABLE)
      .insert(this.mapper.toPersistence(user))
      .onConflict('id')
      .merge();
  }
}

class KnexUserMapper extends Mapper<User> {
  toEntity(data: any): User {
    return new User({
      id: data.id.toString(),
      firstName: data.first_name,
      lastName: data.last_name,
      email: Email.create(data.email),
      isAdmin: data.is_admin,
      hashedPassword: data.hashed_password,
      profilePictureUrl: data.profile_picture_url,
      createdAt: data.created_at,
    });
  }

  toPersistence(entity: User): any {
    const data = entity.data;

    return {
      id: data.id,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email.value,
      is_admin: data.isAdmin,
      hashed_password: data.hashedPassword,
      profile_picture_url: data.profilePictureUrl,
      created_at: data.createdAt,
    };
  }
}
