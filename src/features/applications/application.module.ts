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
import { GithubController } from './github/github.controller';
import { GithubStrategy } from './github/github.strategy';
import { GithubService } from './github/github.service';
import { GetApplicationByIdHandler } from './core/queries/get-application-by-id/get-application-by-id.handler';

@Module({
  imports: [KnexModule, CqrsModule, SystemModule, JwtAuthModule],
  controllers: [ApplicationController, GithubController],
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
  ],
  exports: [
    APPLICATION_REPOSITORY,
    APPLICATION_QUERY_REPOSITORY,
    FindAllApplicationsHandler,
    GetApplicationByIdHandler,
  ],
})
export class ApplicationModule {}
