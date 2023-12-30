/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/

import { Module } from '@nestjs/common';
import { ScheduleAppletExecutionTask } from './tasks/schedule-applet-execution.task';
import { KnexModule } from '../../core/adapters/knex/knex.module';
import { CqrsModule } from '@nestjs/cqrs';
import { SystemModule } from '../../system/system.module';
import { ScheduleAppletExecutionHandler } from './commands/schedule-applet-execution/schedule-applet-execution.handler';
import {
  APPLET_MESSAGE_QUEUE_PROVIDER,
  AppletMessageQueue,
} from './ports/applet.message-queue';
import { ScheduleAllAppletsExecutionHandler } from './commands/schedule-all-applets-execution/schedule-all-applets-execution.handler';
import { APPLET_REPOSITORY, AppletRepository } from './ports/applet.repository';
import { KnexAppletRepository } from './adapters/knex.applet.repository';
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
import { EventModule } from '../events/event.module';
import {
  EVENT_SERVICE,
  EventService,
} from '../events/core/ports/event.service';
import { AppletController } from './controllers/applet.controller';
import { CreateAppletHandler } from './commands/create-applet/create-applet.handler';
import {
  REACTION_REPOSITORY,
  ReactionRepository,
} from '../reactions/core/ports/reaction.repository';
import {
  EVENT_REPOSITORY,
  EventRepository,
} from '../events/core/ports/event.repository';
import {
  USER_CONNECTION_REPOSITORY,
  UserConnectionRepository,
} from '../user-connections/ports/user-connection.repository';
import { ID_PROVIDER, IdProvider } from '../../system/id/id.provider';
import { ReactionModule } from '../reactions/reaction.module';

@Module({
  imports: [
    KnexModule,
    CqrsModule,
    SystemModule,
    KafkaModule,
    UserConnectionsModule,
    EventModule,
    ReactionModule,
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
      provide: APPLET_REPOSITORY,
      useFactory: (knexService: KnexService) => {
        return new KnexAppletRepository(knexService.connection);
      },
      inject: [KnexService],
    },
    {
      provide: ScheduleAppletExecutionHandler,
      useFactory: (
        messageQueueProvider: AppletMessageQueue,
        appletRepository: AppletRepository,
      ) => {
        return new ScheduleAppletExecutionHandler(
          messageQueueProvider,
          appletRepository,
        );
      },
      inject: [APPLET_MESSAGE_QUEUE_PROVIDER, APPLET_REPOSITORY],
    },
    {
      provide: ScheduleAllAppletsExecutionHandler,
      useFactory: (
        messageQueueProvider: AppletMessageQueue,
        appletRepository: AppletRepository,
      ) => {
        return new ScheduleAllAppletsExecutionHandler(
          messageQueueProvider,
          appletRepository,
        );
      },
      inject: [APPLET_MESSAGE_QUEUE_PROVIDER, APPLET_REPOSITORY],
    },
    {
      provide: ExecuteAppletHandler,
      useFactory: (
        appletRepository: AppletRepository,
        eventService: EventService,
      ) => {
        return new ExecuteAppletHandler(appletRepository, eventService);
      },
      inject: [APPLET_REPOSITORY, EVENT_SERVICE],
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
        eventRepository: EventRepository,
        reactionRepository: ReactionRepository,
        userConnectionRepository: UserConnectionRepository,
        idProvider: IdProvider,
      ) => {
        return new CreateAppletHandler(
          appletRepository,
          eventRepository,
          reactionRepository,
          userConnectionRepository,
          idProvider,
        );
      },
      inject: [
        APPLET_REPOSITORY,
        EVENT_REPOSITORY,
        REACTION_REPOSITORY,
        USER_CONNECTION_REPOSITORY,
        ID_PROVIDER,
      ],
    },
    AppletConsumer,
  ],
  controllers: [AppletController],
  exports: [],
})
export class AppletModule {}
