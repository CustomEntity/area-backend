/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-30
 **/

import { Module } from '@nestjs/common';
import { KnexModule } from '../../../core/adapters/knex/knex.module';
import { CqrsModule } from '@nestjs/cqrs';
import { SystemModule } from '../../../system/system.module';
import { KnexService } from '../../../core/adapters/knex/knex.service';
import { APPLICATION_REACTION_QUERY_REPOSITORY } from './ports/application-reaction.query-repository';
import { KnexApplicationReactionQueryRepository } from './adapters/knex.application-reaction.query-repository';
import { GetApplicationReactionsHandler } from './queries/get-application-reactions.handler';
import { APPLICATION_REACTION_REPOSITORY } from './ports/application-reaction.repository';
import { ReactionController } from './controllers/reaction.controller';
import { KnexApplicationReactionRepository } from './adapters/knex.application-reaction.repository';
import { EVENT_SERVICE } from '../events/ports/event.service';
import { ConcreteEventService } from '../events/adapters/concrete.event.service';
import { REACTION_SERVICE } from './ports/reaction.service';
import { ConcreteReactionService } from './adapters/concrete.reaction.service';
import { DiscoveryModule } from '@nestjs/core';
import { GithubApplicationReactionService } from '../external/github/github.application-reaction-service';

@Module({
  imports: [KnexModule, CqrsModule, SystemModule, DiscoveryModule],
  controllers: [ReactionController],
  providers: [
    {
      provide: REACTION_SERVICE,
      useClass: ConcreteReactionService,
    },
    {
      provide: APPLICATION_REACTION_REPOSITORY,
      useFactory: (knexService: KnexService) => {
        return new KnexApplicationReactionRepository(knexService.connection);
      },
      inject: [KnexService],
    },
    {
      provide: APPLICATION_REACTION_QUERY_REPOSITORY,
      useFactory: (knexService: KnexService) => {
        return new KnexApplicationReactionQueryRepository(
          knexService.connection,
        );
      },
      inject: [KnexService],
    },
    {
      provide: GetApplicationReactionsHandler,
      useFactory: (applicationReactionQueryRepository) => {
        return new GetApplicationReactionsHandler(
          applicationReactionQueryRepository,
        );
      },
      inject: [APPLICATION_REACTION_QUERY_REPOSITORY],
    },
    GithubApplicationReactionService,
  ],
  exports: [APPLICATION_REACTION_REPOSITORY, REACTION_SERVICE],
})
export class ReactionModule {}
