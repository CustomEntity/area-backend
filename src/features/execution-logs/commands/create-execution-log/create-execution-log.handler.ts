/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-15
 **/
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateExecutionLogCommand } from './create-execution-log.command';
import { ExecutionLogRepository } from '../../ports/execution-log.repository';
import { IdProvider } from '../../../../system/id/id.provider';
import { ExecutionLog } from '../../entities/execution-log.entity';

@CommandHandler(CreateExecutionLogCommand)
export class CreateExecutionLogHandler
  implements ICommandHandler<CreateExecutionLogCommand>
{
  constructor(
    private readonly executionLogRepository: ExecutionLogRepository,
    private readonly idProvider: IdProvider,
  ) {}

  async execute(command: CreateExecutionLogCommand): Promise<void> {
    const id = command.id ?? this.idProvider.getId();

    return await this.executionLogRepository.save(
      new ExecutionLog({
        id,
        summary: command.summary,
        executionDate: command.executionDate,
        appletId: command.appletId,
      }),
    );
  }
}
