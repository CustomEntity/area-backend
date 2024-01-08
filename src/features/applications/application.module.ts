/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Module } from '@nestjs/common';
import { KnexModule } from '../../core/adapters/knex/knex.module';
import { CqrsModule } from '@nestjs/cqrs';
import { SystemModule } from '../../system/system.module';
import { APPLICATION_REPOSITORY } from './core/ports/application.repository';
import { KnexApplicationRepository } from './core/adapters/knex.application.repository';
import { KnexService } from '../../core/adapters/knex/knex.service';
import {
  APPLICATION_QUERY_REPOSITORY,
  ApplicationQueryRepository,
} from './core/ports/application.query-repository';
import { FindAllApplicationsHandler } from './core/queries/find-all-applications/find-all-applications.handler';
import { KnexApplicationQueryRepository } from './core/adapters/knex.application.query-repository';
import { ApplicationController } from './core/controllers/application.controller';
import { JwtAuthModule } from '../auth/jwt/jwt-auth.module';
import { GithubController } from './external/github/github.controller';
import { GithubStrategy } from './external/github/github.strategy';
import { GithubService } from './external/github/github.service';
import { GetApplicationByIdHandler } from './core/queries/get-application-by-id/get-application-by-id.handler';
import { ReactionModule } from './reactions/reaction.module';
import { EventModule } from './events/event.module';
import { SpotifyController } from './external/spotify/spotify.controller';
import { SpotifyService } from './external/spotify/spotify.service';
import {SpotifyStrategy} from "./external/spotify/spotify.strategy";
import {DiscoveryModule} from "@nestjs/core";
import {GithubApplicationEventService} from "./external/github/github.application-event-service";
import {SpotifyApplicationEventService} from "./external/spotify/spotify.application-event-service";
import {SteamController} from "./external/steam/steam.controller";

@Module({
  imports: [
    KnexModule,
    CqrsModule,
    SystemModule,
    JwtAuthModule,
    ReactionModule,
    EventModule,
      DiscoveryModule
  ],
  controllers: [ApplicationController, GithubController, SpotifyController, SteamController],
  providers: [
    {
      provide: APPLICATION_REPOSITORY,
      useFactory: (knexService: KnexService) => {
        return new KnexApplicationRepository(knexService.connection);
      },
      inject: [KnexService],
    },
    {
      provide: APPLICATION_QUERY_REPOSITORY,
      useFactory: (knexService: KnexService) => {
        return new KnexApplicationQueryRepository(knexService.connection);
      },
      inject: [KnexService],
    },
    {
      provide: FindAllApplicationsHandler,
      useFactory: (applicationQueryRepository: ApplicationQueryRepository) => {
        return new FindAllApplicationsHandler(applicationQueryRepository);
      },
      inject: [APPLICATION_QUERY_REPOSITORY],
    },
    {
      provide: GetApplicationByIdHandler,
      useFactory: (applicationQueryRepository: ApplicationQueryRepository) => {
        return new GetApplicationByIdHandler(applicationQueryRepository);
      },
      inject: [APPLICATION_QUERY_REPOSITORY],
    },
    GithubStrategy,
    GithubService,
    SpotifyStrategy,
    SpotifyService,
    GithubApplicationEventService,
    SpotifyApplicationEventService,
  ],
  exports: [
    APPLICATION_REPOSITORY,
    APPLICATION_QUERY_REPOSITORY,
    FindAllApplicationsHandler,
    GetApplicationByIdHandler,
    EventModule,
    ReactionModule,
  ],
})
export class ApplicationModule {}
