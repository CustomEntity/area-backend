/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-25
 **/
import { Module } from '@nestjs/common';
import { EVENT_SERVICE } from './ports/event.service';
import { ConcreteEventService } from './adapters/concrete.event.service';
import { APPLICATION_EVENT_REPOSITORY } from './ports/application-event.repository';
import { KnexService } from '../../../core/adapters/knex/knex.service';
import { KnexModule } from '../../../core/adapters/knex/knex.module';
import { CqrsModule } from '@nestjs/cqrs';
import { SystemModule } from '../../../system/system.module';
import { KnexApplicationEventRepository } from './adapters/knex.application-event.repository';
import { EventController } from './controllers/event.controller';
import {
  APPLICATION_EVENT_QUERY_REPOSITORY,
  ApplicationEventQueryRepository,
} from './ports/application-event.query-repository';
import { KnexApplicationEventQueryRepository } from './adapters/knex.application-event.query-repository';
import { GetApplicationEventsHandler } from './queries/get-application-events.handler';

@Module({
  imports: [KnexModule, CqrsModule, SystemModule],
  controllers: [EventController],
  providers: [
    {
      provide: EVENT_SERVICE,
      useClass: ConcreteEventService,
    },
    {
      provide: APPLICATION_EVENT_REPOSITORY,
      useFactory: (knexService: KnexService) => {
        return new KnexApplicationEventRepository(knexService.connection);
      },
      inject: [KnexService],
    },
    {
      provide: APPLICATION_EVENT_QUERY_REPOSITORY,
      useFactory: (knexService: KnexService) => {
        return new KnexApplicationEventQueryRepository(knexService.connection);
      },
      inject: [KnexService],
    },
    {
      provide: GetApplicationEventsHandler,
      useFactory: (
        applicationEventQueryRepository: ApplicationEventQueryRepository,
      ) => {
        return new GetApplicationEventsHandler(applicationEventQueryRepository);
      },
      inject: [APPLICATION_EVENT_QUERY_REPOSITORY],
    },
  ],
  exports: [EVENT_SERVICE, APPLICATION_EVENT_REPOSITORY],
})
export class EventModule {}
