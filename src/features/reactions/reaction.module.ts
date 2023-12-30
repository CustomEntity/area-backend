/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-30
 **/

import { Module } from '@nestjs/common';
import { KnexModule } from '../../core/adapters/knex/knex.module';
import { CqrsModule } from '@nestjs/cqrs';
import { SystemModule } from '../../system/system.module';
import { KnexService } from '../../core/adapters/knex/knex.service';
import { REACTION_REPOSITORY } from './core/ports/reaction.repository';
import { KnexReactionRepository } from './core/adapters/knex.reaction.repository';

@Module({
  imports: [KnexModule, CqrsModule, SystemModule],
  providers: [
    {
      provide: REACTION_REPOSITORY,
      useFactory: (knexService: KnexService) => {
        return new KnexReactionRepository(knexService.connection);
      },
      inject: [KnexService],
    },
  ],
  exports: [REACTION_REPOSITORY],
})
export class ReactionModule {}
