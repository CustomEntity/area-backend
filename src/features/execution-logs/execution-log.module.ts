/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { KnexModule } from '../../core/adapters/knex/knex.module';
import { CqrsModule } from '@nestjs/cqrs';
import { SystemModule } from '../../system/system.module';
import { ExecutionLogController } from './controllers/execution-log.controller';
import { Module } from '@nestjs/common';
import { EXECUTION_LOG_REPOSITORY } from './ports/execution-log.repository';
import { LOG_REPOSITORY } from './ports/log.repository';
import { KnexLogRepository } from './adapters/knex.log.repository';
import { KnexService } from '../../core/adapters/knex/knex.service';
import { EXECUTION_LOG_QUERY_REPOSITORY } from './ports/execution-log.query-repository';
import { KnexExecutionLogQueryRepository } from './adapters/knex.execution-log.query-repository';
import { GetExecutionLogsByUserHandler } from './queries/get-execution-logs-by-user/get-execution-logs-by-user.handler';

@Module({
  imports: [KnexModule, CqrsModule, SystemModule],
  controllers: [ExecutionLogController],
  providers: [
    {
      provide: LOG_REPOSITORY,
      useFactory: (knexService: KnexService) =>
        new KnexLogRepository(knexService.connection),
      inject: [KnexService],
    },
    {
      provide: EXECUTION_LOG_REPOSITORY,
      useFactory: (knexService: KnexService) =>
        new KnexLogRepository(knexService.connection),
      inject: [KnexService],
    },
    {
      provide: EXECUTION_LOG_QUERY_REPOSITORY,
      useFactory: (knexService: KnexService) =>
        new KnexExecutionLogQueryRepository(knexService.connection),
      inject: [KnexService],
    },
    {
      provide: GetExecutionLogsByUserHandler,
      useFactory: (
        executionLogQueryRepository: KnexExecutionLogQueryRepository,
      ) => new GetExecutionLogsByUserHandler(executionLogQueryRepository),
      inject: [EXECUTION_LOG_QUERY_REPOSITORY],
    },
  ],
  exports: [],
})
export class ExecutionLogModule {}
