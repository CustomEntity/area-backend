/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Module } from '@nestjs/common';
import { KnexModule } from '../../core/adapters/knex/knex.module';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { SystemModule } from '../../system/system.module';
import {
  USER_CONNECTION_REPOSITORY,
  UserConnectionRepository,
} from './ports/user-connection.repository';
import { KnexService } from '../../core/adapters/knex/knex.service';
import { KnexUserConnectionRepository } from './adapters/knex.user-connection.repository';
import { CreateUserConnectionHandler } from './commands/create-user-connection/create-user-connection.handler';
import { CurrentDateProvider } from '../../system/date/current-date.provider';
import { SnowflakeIdProvider } from '../../system/id/snowflake.provider';
import { DATE_PROVIDER } from '../../system/date/date.provider';
import { ID_PROVIDER } from '../../system/id/id.provider';
import {
  EVENT_DISPATCHER,
  EventDispatcher,
} from '../../system/event/event-dispatcher.provider';
import { UserConnectionController } from './controllers/user-connection.controller';
import { DeleteUserConnectionHandler } from './commands/delete-user-connection/delete-user-connection.handler';
import { RenameUserConnectionHandler } from './commands/rename-user-connection/rename-user-connection.handler';
import {
  USER_CONNECTION_QUERY_REPOSITORY,
  UserConnectionQueryRepository,
} from './ports/user-connection.query-repository';
import { GetUserConnectionsHandler } from './queries/get-user-connections/get-user-connections.handler';
import { KnexUserConnectionQueryRepository } from './adapters/knex.user-connection.query-repository';
import { GetUserConnectionHandler } from './queries/get-user-connection/get-user-connection.handler';
import {
  ENCRYPTION_PROVIDER,
  EncryptionProvider,
} from '../../system/encryption/encryption.provider';
import { UserConnectionEventListener } from './adapters/user-connection.event-listener';
import { DeleteUserConnectionsHandler } from './commands/delete-user-connections/delete-user-connections.handler';

@Module({
  imports: [KnexModule, CqrsModule, SystemModule],
  controllers: [UserConnectionController],
  providers: [
    {
      provide: USER_CONNECTION_REPOSITORY,
      useFactory: (knexService: KnexService) => {
        return new KnexUserConnectionRepository(knexService.connection);
      },
      inject: [KnexService],
    },
    {
      provide: USER_CONNECTION_QUERY_REPOSITORY,
      useFactory: (knexService: KnexService) => {
        return new KnexUserConnectionQueryRepository(knexService.connection);
      },
      inject: [KnexService],
    },
    {
      provide: GetUserConnectionsHandler,
      useFactory: (
        userConnectionQueryRepository: UserConnectionQueryRepository,
      ) => {
        return new GetUserConnectionsHandler(userConnectionQueryRepository);
      },
      inject: [USER_CONNECTION_QUERY_REPOSITORY],
    },
    {
      provide: CreateUserConnectionHandler,
      useFactory: (
        userConnectionRepository: KnexUserConnectionRepository,
        dateProvider: CurrentDateProvider,
        idProvider: SnowflakeIdProvider,
        eventDispatcher: EventDispatcher,
        encryptionProvider: EncryptionProvider,
      ) => {
        return new CreateUserConnectionHandler(
          userConnectionRepository,
          dateProvider,
          idProvider,
          eventDispatcher,
          encryptionProvider,
        );
      },
      inject: [
        USER_CONNECTION_REPOSITORY,
        DATE_PROVIDER,
        ID_PROVIDER,
        EVENT_DISPATCHER,
        ENCRYPTION_PROVIDER,
      ],
    },
    {
      provide: DeleteUserConnectionHandler,
      useFactory: (
        userConnectionRepository: UserConnectionRepository,
        eventDispatcher: EventDispatcher,
      ) => {
        return new DeleteUserConnectionHandler(
          userConnectionRepository,
          eventDispatcher,
        );
      },
      inject: [USER_CONNECTION_REPOSITORY, EVENT_DISPATCHER],
    },
    {
      provide: RenameUserConnectionHandler,
      useFactory: (
        userConnectionRepository: UserConnectionRepository,
        eventDispatcher: EventDispatcher,
      ) => {
        return new RenameUserConnectionHandler(
          userConnectionRepository,
          eventDispatcher,
        );
      },
      inject: [USER_CONNECTION_REPOSITORY, EVENT_DISPATCHER],
    },
    {
      provide: GetUserConnectionHandler,
      useFactory: (
        userConnectionQueryRepository: UserConnectionQueryRepository,
      ) => {
        return new GetUserConnectionHandler(userConnectionQueryRepository);
      },
      inject: [USER_CONNECTION_QUERY_REPOSITORY],
    },
    {
      provide: DeleteUserConnectionsHandler,
      useFactory: (userConnectionRepository: UserConnectionRepository) => {
        return new DeleteUserConnectionsHandler(userConnectionRepository);
      },
      inject: [USER_CONNECTION_REPOSITORY],
    },
    {
      provide: UserConnectionEventListener,
      useFactory: (commandBus: CommandBus) => {
        return new UserConnectionEventListener(commandBus);
      },
      inject: [CommandBus],
    },
  ],
  exports: [USER_CONNECTION_REPOSITORY],
})
export class UserConnectionsModule {}
