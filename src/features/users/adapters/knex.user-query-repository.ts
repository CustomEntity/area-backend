/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Injectable } from '@nestjs/common';
import { UserQueryRepository } from '../ports/user.query-repository';
import { Nullable } from '../../../shared/nullable';
import { FindUserByEmailResult } from '../queries/find-user-by-email/find-user-by-email.result';
import { FindUserByIdResult } from '../queries/find-user-by-id/find-user-by-id.result';
import { Knex } from 'knex';
import { GetUsersResult } from '../queries/get-users/get-users.result';

@Injectable()
export class KnexUserQueryRepository implements UserQueryRepository {
  constructor(private readonly connection: Knex) {}

  async findByEmail(email: string): Promise<Nullable<FindUserByEmailResult>> {
    const user = await this.connection('users')
      .select()
      .where('email', email)
      .first();

    if (user == null) {
      return null;
    }

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      createdAt: user.created_at,
    };
  }

  async findById(id: string): Promise<Nullable<FindUserByIdResult>> {
    const user = await this.connection('users')
      .select()
      .where('id', id)
      .first();

    if (user == null) {
      return null;
    }

    return {
      id: user.id.toString(),
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      createdAt: user.created_at,
    };
  }

  async findAndCount(take: number, skip: number): Promise<GetUsersResult> {
    const users = await this.connection('users')
      .limit(take)
      .offset(skip)
      .select('*');

    const count = await this.connection('users').count('id as total').first();

    return {
      users: users.map((user) => ({
        id: user.id.toString(),
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        createdAt: user.created_at,
      })),
      count: parseInt((count?.total ?? '0').toString(), 10),
    };
  }
}
