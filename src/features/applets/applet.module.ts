/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/

import { Module } from '@nestjs/common';
import { ScheduleAppletExecutionTask } from './tasks/schedule-applet-execution.task';
import { KnexModule } from '../../core/adapters/knex/knex.module';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { SystemModule } from '../../system/system.module';
import { ScheduleAppletExecutionHandler } from './commands/schedule-applet-execution/schedule-applet-execution.handler';
import {
  APPLET_MESSAGE_QUEUE_PROVIDER,
  AppletMessageQueue,
} from './ports/applet.message-queue';
import { ScheduleAllAppletsExecutionHandler } from './commands/schedule-all-applets-execution/schedule-all-applets-execution.handler';
import {
  DETAILED_APPLET_REPOSITORY,
  DetailedAppletRepository,
} from './ports/detailed-applet.repository';
import { KnexDetailedAppletRepository } from './adapters/knex.detailed-applet.repository';
import { KnexService } from '../../core/adapters/knex/knex.service';
import { AppletConsumer } from './consumers/applet.consumer';
import { KafkaService } from '../../core/adapters/kafka/kafka.service';
import { ConfigService } from '@nestjs/config';
import { KafkaMessageQueueProvider } from './adapters/kafka.message-queue.provider';
import { KafkaModule } from '../../core/adapters/kafka/kafka.module';
import { UserConnectionsModule } from '../user-connections/user-connections.module';
import { ExecuteAppletHandler } from './commands/execute-applet/execute-applet.handler';
import { AppletEventListener } from './adapters/applet.event-listener';
import { RemoveUserConnectionHandler } from './commands/remove-user-connection/remove-user-connection.handler';
import { EventModule } from '../applications/events/event.module';
import {
  EVENT_SERVICE,
  EventService,
} from '../applications/events/ports/event.service';
import { AppletController } from './controllers/applet.controller';
import { CreateAppletHandler } from './commands/create-applet/create-applet.handler';
import {
  APPLICATION_REACTION_REPOSITORY,
  ApplicationReactionRepository,
} from '../applications/reactions/ports/application-reaction.repository';
import {
  APPLICATION_EVENT_REPOSITORY,
  ApplicationEventRepository,
} from '../applications/events/ports/application-event.repository';
import {
  USER_CONNECTION_REPOSITORY,
  UserConnectionRepository,
} from '../user-connections/ports/user-connection.repository';
import { ID_PROVIDER, IdProvider } from '../../system/id/id.provider';
import { ReactionModule } from '../applications/reactions/reaction.module';
import { APPLET_REPOSITORY, AppletRepository } from './ports/applet.repository';
import { KnexAppletRepository } from './adapters/knex.applet.repository';
import {
  APPLET_QUERY_REPOSITORY,
  AppletQueryRepository,
} from './ports/applet.query-repository';
import { GetUserAppletsHandler } from './queries/get-user-applets/get-user-applets.handler';
import { KnexAppletQueryRepository } from './adapters/knex.applet.query-repository';
import { GetUserAppletHandler } from './queries/get-user-applet/get-user-applet.handler';
import { DeleteAppletHandler } from './commands/delete-applet/delete-applet.handler';
import { EditAppletHandler } from './commands/edit-applet/edit-applet.handler';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../users/ports/user.repository';
import { UserModule } from '../users/user.module';
import {
  REACTION_SERVICE,
  ReactionService,
} from '../applications/reactions/ports/reaction.service';
import {
  ENCRYPTION_PROVIDER,
  EncryptionProvider,
} from '../../system/encryption/encryption.provider';
import { RedisService } from '../../core/adapters/redis/redis.service';

@Module({
  imports: [
    KnexModule,
    CqrsModule,
    SystemModule,
    KafkaModule,
    UserConnectionsModule,
    EventModule,
    ReactionModule,
    UserModule,
  ],
  providers: [
    ScheduleAppletExecutionTask,
    AppletEventListener,
    {
      provide: APPLET_MESSAGE_QUEUE_PROVIDER,
      useFactory: async (
        kafkaService: KafkaService,
        configService: ConfigService,
      ) => {
        await kafkaService.init();
        return new KafkaMessageQueueProvider(
          configService,
          kafkaService.producer,
        );
      },
      inject: [KafkaService, ConfigService],
    },
    {
      provide: DETAILED_APPLET_REPOSITORY,
      useFactory: (knexService: KnexService) => {
        return new KnexDetailedAppletRepository(knexService.connection);
      },
      inject: [KnexService],
    },
    {
      provide: APPLET_REPOSITORY,
      useFactory: (knexService: KnexService) => {
        return new KnexAppletRepository(knexService.connection);
      },
      inject: [KnexService],
    },
    {
      provide: APPLET_QUERY_REPOSITORY,
      useFactory: (knexService: KnexService) => {
        return new KnexAppletQueryRepository(knexService.connection);
      },
      inject: [KnexService],
    },
    {
      provide: ScheduleAppletExecutionHandler,
      useFactory: (
        messageQueueProvider: AppletMessageQueue,
        appletRepository: DetailedAppletRepository,
      ) => {
        return new ScheduleAppletExecutionHandler(
          messageQueueProvider,
          appletRepository,
        );
      },
      inject: [APPLET_MESSAGE_QUEUE_PROVIDER, DETAILED_APPLET_REPOSITORY],
    },
    {
      provide: ScheduleAllAppletsExecutionHandler,
      useFactory: (
        messageQueueProvider: AppletMessageQueue,
        appletRepository: DetailedAppletRepository,
      ) => {
        return new ScheduleAllAppletsExecutionHandler(
          messageQueueProvider,
          appletRepository,
        );
      },
      inject: [APPLET_MESSAGE_QUEUE_PROVIDER, DETAILED_APPLET_REPOSITORY],
    },
    {
      provide: ExecuteAppletHandler,
      useFactory: (
        appletRepository: DetailedAppletRepository,
        eventService: EventService,
        reactionService: ReactionService,
        encryptionProvider: EncryptionProvider,
      ) => {
        return new ExecuteAppletHandler(
          appletRepository,
          eventService,
          reactionService,
          encryptionProvider,
        );
      },
      inject: [
        DETAILED_APPLET_REPOSITORY,
        EVENT_SERVICE,
        REACTION_SERVICE,
        ENCRYPTION_PROVIDER,
      ],
    },
    {
      provide: RemoveUserConnectionHandler,
      useFactory: (appletRepository: AppletRepository) => {
        return new RemoveUserConnectionHandler(appletRepository);
      },
      inject: [APPLET_REPOSITORY],
    },
    {
      provide: CreateAppletHandler,
      useFactory: (
        appletRepository: AppletRepository,
        eventRepository: ApplicationEventRepository,
        reactionRepository: ApplicationReactionRepository,
        userConnectionRepository: UserConnectionRepository,
        idProvider: IdProvider,
        userRepository: UserRepository,
      ) => {
        return new CreateAppletHandler(
          appletRepository,
          eventRepository,
          reactionRepository,
          userConnectionRepository,
          idProvider,
          userRepository,
        );
      },
      inject: [
        APPLET_REPOSITORY,
        APPLICATION_EVENT_REPOSITORY,
        APPLICATION_REACTION_REPOSITORY,
        USER_CONNECTION_REPOSITORY,
        ID_PROVIDER,
        USER_REPOSITORY,
      ],
    },
    {
      provide: GetUserAppletsHandler,
      useFactory: (appletQueryRepository: AppletQueryRepository) => {
        return new GetUserAppletsHandler(appletQueryRepository);
      },
      inject: [APPLET_QUERY_REPOSITORY],
    },
    {
      provide: GetUserAppletHandler,
      useFactory: (appletQueryRepository: AppletQueryRepository) => {
        return new GetUserAppletHandler(appletQueryRepository);
      },
      inject: [APPLET_QUERY_REPOSITORY],
    },
    {
      provide: DeleteAppletHandler,
      useFactory: (appletRepository: AppletRepository) => {
        return new DeleteAppletHandler(appletRepository);
      },
      inject: [APPLET_REPOSITORY],
    },
    {
      provide: EditAppletHandler,
      useFactory: (appletRepository: AppletRepository) => {
        return new EditAppletHandler(appletRepository);
      },
      inject: [APPLET_REPOSITORY],
    },
    {
      provide: ScheduleAppletExecutionTask,
      useFactory: (redisService: RedisService, commandBus: CommandBus) => {
        return new ScheduleAppletExecutionTask(
          redisService.connection,
          commandBus,
        );
      },
      inject: [RedisService, CommandBus],
    },
    AppletConsumer,
  ],
  controllers: [AppletController],
  exports: [
    DETAILED_APPLET_REPOSITORY,
    APPLET_REPOSITORY,
    APPLET_QUERY_REPOSITORY,
  ],
})
export class AppletModule {}
