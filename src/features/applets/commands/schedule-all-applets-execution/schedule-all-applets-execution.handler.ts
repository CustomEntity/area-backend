/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-18
 **/
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppletMessageQueue } from '../../ports/applet.message-queue';
import { ScheduleAllAppletsExecutionCommand } from './schedule-all-applets-execution.command';
import { AppletRepository } from '../../ports/applet.repository';

@CommandHandler(ScheduleAllAppletsExecutionCommand)
export class ScheduleAllAppletsExecutionHandler
  implements ICommandHandler<ScheduleAllAppletsExecutionCommand>
{
  constructor(
    private readonly messageQueueProvider: AppletMessageQueue,
    public readonly appletRepository: AppletRepository,
  ) {}

  async execute(command: ScheduleAllAppletsExecutionCommand): Promise<void> {
    // TODO: Scale this to a large number of applets because this will be a bottleneck :(
    const applets = await this.appletRepository.findPollingApplets();

    await this.messageQueueProvider.bulkPublishAppletExecution(
      applets.map((applet) => applet.id),
    );
    console.log('ScheduleAllAppletsExecutionHandler:execute');
  }
}
