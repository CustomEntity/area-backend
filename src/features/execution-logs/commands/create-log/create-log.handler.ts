/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-15
 **/
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IdProvider } from '../../../../system/id/id.provider';
import { CreateLogCommand } from './create-log.command';
import { LogRepository } from '../../ports/log.repository';
import { Log } from '../../entities/log.entity';
import { LogLevel } from '../../value-objects/log-level';

@CommandHandler(CreateLogCommand)
export class CreateLogHandler implements ICommandHandler<CreateLogCommand> {
  constructor(
    private readonly logRepository: LogRepository,
    private readonly idProvider: IdProvider,
  ) {}

  async execute(command: CreateLogCommand): Promise<void> {
    const id = command.id ?? this.idProvider.getId();

    const log = new Log({
      id,
      executionLogId: command.executionLogId,
      logLevel: LogLevel.create(command.level),
      message: command.message,
      logDate: command.logDate,
    });

    await this.logRepository.save(log);
  }
}
