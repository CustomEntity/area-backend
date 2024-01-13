/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Injectable, Module } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from './ports/user.repository';
import { CreateUserHandler } from './commands/create-user/create-user.handler';
import { CurrentDateProvider } from '../../system/date/current-date.provider';
import { SnowflakeIdProvider } from '../../system/id/snowflake.provider';
import { ArgonHashProvider } from '../../system/hash/argon-hash.provider';
import { DATE_PROVIDER } from '../../system/date/date.provider';
import { ID_PROVIDER } from '../../system/id/id.provider';
import { HASH_PROVIDER } from '../../system/hash/hash.provider';
import { SystemModule } from '../../system/system.module';
import { User } from './entities/user.entity';
import { USER_QUERY_REPOSITORY } from './ports/user.query-repository';
import { UserController } from './controllers/user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { FindUserByIdHandler } from './queries/find-user-by-id/find-user-by-id.handler';
import { FindUserByEmailHandler } from './queries/find-user-by-email/find-user-by-email.handler';
import { KnexModule } from '../../core/adapters/knex/knex.module';
import { KnexUserQueryRepository } from './adapters/knex.user-query-repository';
import { KnexUserRepository } from './adapters/knex.user-repository';
import { KnexService } from '../../core/adapters/knex/knex.service';

@Injectable()
export class InMemoryUserService {
  public users: User[] = [];
}

@Module({
  imports: [KnexModule, CqrsModule, SystemModule],
  controllers: [UserController],
  providers: [
    InMemoryUserService,
    {
      provide: USER_REPOSITORY,
      useFactory: (knexService: KnexService) => {
        return new KnexUserRepository(knexService.connection);
      },
      inject: [KnexService],
    },
    {
      provide: USER_QUERY_REPOSITORY,
      useFactory: (knexService: KnexService) => {
        return new KnexUserQueryRepository(knexService.connection);
      },
      inject: [KnexService],
    },
    {
      provide: CreateUserHandler,
      useFactory: (
        userRepository: UserRepository,
        dateProvider: CurrentDateProvider,
        idProvider: SnowflakeIdProvider,
        hashProvider: ArgonHashProvider,
      ) => {
        return new CreateUserHandler(
          userRepository,
          dateProvider,
          idProvider,
          hashProvider,
        );
      },
      inject: [USER_REPOSITORY, DATE_PROVIDER, ID_PROVIDER, HASH_PROVIDER],
    },
    {
      provide: FindUserByIdHandler,
      useFactory: (userQueryRepository: KnexUserQueryRepository) => {
        return new FindUserByIdHandler(userQueryRepository);
      },
      inject: [USER_QUERY_REPOSITORY],
    },
    {
      provide: FindUserByEmailHandler,
      useFactory: (userQueryRepository: KnexUserQueryRepository) => {
        return new FindUserByEmailHandler(userQueryRepository);
      },
      inject: [USER_QUERY_REPOSITORY],
    },
  ],
  exports: [USER_REPOSITORY, USER_QUERY_REPOSITORY, CreateUserHandler],
})
export class UserModule {}
