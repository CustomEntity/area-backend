/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { KnexModule } from '../../core/adapters/knex/knex.module';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { SystemModule } from '../../system/system.module';
import { ExecutionLogController } from './controllers/execution-log.controller';
import { Module } from '@nestjs/common';
import {
  EXECUTION_LOG_REPOSITORY,
  ExecutionLogRepository,
} from './ports/execution-log.repository';
import { LOG_REPOSITORY, LogRepository } from './ports/log.repository';
import { KnexLogRepository } from './adapters/knex.log.repository';
import { KnexService } from '../../core/adapters/knex/knex.service';
import { EXECUTION_LOG_QUERY_REPOSITORY } from './ports/execution-log.query-repository';
import { KnexExecutionLogQueryRepository } from './adapters/knex.execution-log.query-repository';
import { GetExecutionLogsByUserHandler } from './queries/get-execution-logs-by-user/get-execution-logs-by-user.handler';
import { LOG_QUERY_REPOSITORY } from './ports/log.query-repository';
import { KnexLogQueryRepository } from './adapters/knex.log.query-repository';
import { GetExecutionLogLogsHandler } from './queries/get-execution-log-logs/get-execution-log-logs.handler';
import { CreateExecutionLogHandler } from './commands/create-execution-log/create-execution-log.handler';
import { ID_PROVIDER, IdProvider } from '../../system/id/id.provider';
import { CreateLogHandler } from './commands/create-log/create-log.handler';
import { EXECUTION_LOG_SERVICE } from './services/execution-log.service';
import { ConcreteExecutionLogService } from './adapters/concrete.execution-log.service';
import { DATE_PROVIDER } from '../../system/date/date.provider';
import { KnexExecutionLogRepository } from './adapters/knex.execution-log.repository';

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
        new KnexExecutionLogRepository(knexService.connection),
      inject: [KnexService],
    },
    {
      provide: EXECUTION_LOG_QUERY_REPOSITORY,
      useFactory: (knexService: KnexService) =>
        new KnexExecutionLogQueryRepository(knexService.connection),
      inject: [KnexService],
    },
    {
      provide: LOG_QUERY_REPOSITORY,
      useFactory: (knexService: KnexService) =>
        new KnexLogQueryRepository(knexService.connection),
      inject: [KnexService],
    },
    {
      provide: GetExecutionLogsByUserHandler,
      useFactory: (
        executionLogQueryRepository: KnexExecutionLogQueryRepository,
      ) => new GetExecutionLogsByUserHandler(executionLogQueryRepository),
      inject: [EXECUTION_LOG_QUERY_REPOSITORY],
    },
    {
      provide: GetExecutionLogLogsHandler,
      useFactory: (logQueryRepository: KnexLogQueryRepository) =>
        new GetExecutionLogLogsHandler(logQueryRepository),
      inject: [LOG_QUERY_REPOSITORY],
    },
    {
      provide: CreateExecutionLogHandler,
      useFactory: (
        executionLogRepository: ExecutionLogRepository,
        idProvider: IdProvider,
      ) => new CreateExecutionLogHandler(executionLogRepository, idProvider),
      inject: [EXECUTION_LOG_REPOSITORY, ID_PROVIDER],
    },
    {
      provide: CreateLogHandler,
      useFactory: (logRepository: LogRepository, idProvider: IdProvider) =>
        new CreateLogHandler(logRepository, idProvider),
      inject: [LOG_REPOSITORY, ID_PROVIDER],
    },
    {
      provide: EXECUTION_LOG_SERVICE,
      useFactory: (commandBus, dateProvider) =>
        new ConcreteExecutionLogService(commandBus, dateProvider),
      inject: [CommandBus, DATE_PROVIDER],
    },
  ],
  exports: [EXECUTION_LOG_SERVICE],
})
export class ExecutionLogModule {}
