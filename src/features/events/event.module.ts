/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-25
 **/
import { Module } from '@nestjs/common';
import { EVENT_SERVICE } from './core/ports/event.service';
import { ConcreteEventService } from './core/adapters/concrete.event.service';
import { EVENT_REPOSITORY } from './core/ports/event.repository';
import { KnexService } from '../../core/adapters/knex/knex.service';
import { KnexModule } from '../../core/adapters/knex/knex.module';
import { CqrsModule } from '@nestjs/cqrs';
import { SystemModule } from '../../system/system.module';
import { KnexEventRepository } from './core/adapters/knex.event.repository';

@Module({
  imports: [KnexModule, CqrsModule, SystemModule],
  providers: [
    {
      provide: EVENT_SERVICE,
      useClass: ConcreteEventService,
    },
    {
      provide: EVENT_REPOSITORY,
      useFactory: (knexService: KnexService) => {
        return new KnexEventRepository(knexService.connection);
      },
      inject: [KnexService],
    },
  ],
  exports: [EVENT_SERVICE, EVENT_REPOSITORY],
})
export class EventModule {}
