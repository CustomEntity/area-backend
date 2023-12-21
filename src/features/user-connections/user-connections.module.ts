/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Module } from '@nestjs/common';
import { KnexModule } from '../../core/adapters/knex/knex.module';
import { CqrsModule } from '@nestjs/cqrs';
import { SystemModule } from '../../system/system.module';
import { USER_CONNECTION_REPOSITORY } from './ports/user-connection.repository';
import { KnexService } from '../../core/adapters/knex/knex.service';
import { KnexUserConnectionRepository } from './adapters/knex.user-connection.repository';
import { CreateUserConnectionHandler } from './commands/create-user-connection/create-user-connection.handler';
import { CurrentDateProvider } from '../../system/date/current-date.provider';
import { SnowflakeIdProvider } from '../../system/id/snowflake.provider';
import { DATE_PROVIDER } from '../../system/date/date.provider';
import { ID_PROVIDER } from '../../system/id/id.provider';
import { KnexApplicationRepository } from '../applications/core/adapters/knex.application.repository';
import { ApplicationModule } from '../applications/application.module';
import { APPLICATION_REPOSITORY } from '../applications/core/ports/application.repository';
import {EVENT_DISPATCHER, EventDispatcher} from "../../system/event/event-dispatcher.provider";

@Module({
    imports: [KnexModule, CqrsModule, SystemModule],
    controllers: [],
    providers: [
        {
            provide: USER_CONNECTION_REPOSITORY,
            useFactory: (knexService: KnexService) => {
                return new KnexUserConnectionRepository(knexService.connection);
            },
            inject: [KnexService],
        },
        {
            provide: CreateUserConnectionHandler,
            useFactory: (
                userConnectionRepository: KnexUserConnectionRepository,
                dateProvider: CurrentDateProvider,
                idProvider: SnowflakeIdProvider,
                eventDispatcher: EventDispatcher,
            ) => {
                return new CreateUserConnectionHandler(
                    userConnectionRepository,
                    dateProvider,
                    idProvider,
                    eventDispatcher,
                );
            },
            inject: [
                USER_CONNECTION_REPOSITORY,
                DATE_PROVIDER,
                ID_PROVIDER,
                EVENT_DISPATCHER,
            ],
        },
    ],
    exports: [USER_CONNECTION_REPOSITORY],
})
export class UserConnectionsModule {}
