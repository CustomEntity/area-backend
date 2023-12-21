/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { ConfigService } from '@nestjs/config';
import { Knex, knex } from 'knex';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KnexService {
  private readonly knex: Knex;

  constructor(private readonly configService: ConfigService) {
    try {
      this.knex = knex({
        client: 'pg',
        connection: {
          host: configService.get<string>('postgres.host'),
          user: configService.get<string>('postgres.user'),
          password: configService.get<string>('postgres.password'),
          database: configService.get<string>('postgres.database'),
          port: configService.get<number>('postgres.port'),
          timezone: 'utc',
        },
      });
      console.log('KnexService: Connected to Postgres');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  get connection(): Knex {
    return this.knex;
  }
}
