/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-18
 **/
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppletRepository } from '../../ports/applet.repository';
import { ExecuteAppletCommand } from './execute-applet.command';

@CommandHandler(ExecuteAppletCommand)
export class ExecuteAppletHandler
  implements ICommandHandler<ExecuteAppletCommand>
{
  constructor(
    public readonly appletRepository: AppletRepository,
  ) {}

  async execute(command: ExecuteAppletCommand): Promise<void> {
    const appletId = command.appletId;

    const applet = await this.appletRepository.findById(appletId);
    if (!applet) {
      throw new Error(`Applet with id ${appletId} not found`);
    }

    /*const eventsData = await this.eventService.retrieveNewEventsData(
      applet.eventConnection.value.application.name,
      applet.event.value.name,
      applet.eventTriggerData?.value || null,
      applet.eventConnection.value.connectionCredentials,
    );
    console.log(eventsData);*/
  }
}
