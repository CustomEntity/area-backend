/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-16
 **/
import {
  ExecutionLogData,
  ExecutionLogService,
  LogLevelMapping,
} from '../services/execution-log.service';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateExecutionLogCommand } from '../commands/create-execution-log/create-execution-log.command';
import { CreateLogCommand } from '../commands/create-log/create-log.command';
import { DateProvider } from '../../../system/date/date.provider';

@Injectable()
export class ConcreteExecutionLogService implements ExecutionLogService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly dateProvider: DateProvider,
  ) {}

  async createExecutionLog(executionlog: ExecutionLogData): Promise<void> {
    return await this.commandBus.execute(
      new CreateExecutionLogCommand(
        executionlog.appletId,
        executionlog.summary,
        executionlog.executionDate,
        executionlog.id,
      ),
    );
  }

  async log(
    executionLogId: string,
    logLevel: keyof typeof LogLevelMapping,
    message: string,
  ): Promise<void> {
    await this.commandBus.execute(
      new CreateLogCommand(
        executionLogId,
        LogLevelMapping[logLevel],
        message,
        this.dateProvider.getDate(),
      ),
    );
  }
}
