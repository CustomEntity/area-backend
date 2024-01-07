/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-18
 **/
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DetailedAppletRepository } from '../../ports/detailed-applet.repository';
import { ExecuteAppletCommand } from './execute-applet.command';
import { EventService } from '../../../applications/events/ports/event.service';
import { ReactionService } from '../../../applications/reactions/ports/reaction.service';

@CommandHandler(ExecuteAppletCommand)
export class ExecuteAppletHandler
  implements ICommandHandler<ExecuteAppletCommand>
{
  constructor(
    public readonly appletRepository: DetailedAppletRepository,
    public readonly eventService: EventService,
    public readonly reactionService: ReactionService,
  ) {}

  async execute(command: ExecuteAppletCommand): Promise<void> {
    const appletId = command.appletId;

    const applet = await this.appletRepository.findById(appletId);
    if (!applet) {
      throw new Error(`Applet with id ${appletId} not found`);
    }

    if (!applet.eventConnection) return;
    const eventsData = await this.eventService.retrieveNewEventsData(
      applet.id,
      applet.eventConnection.value.application.name,
      applet.event.value.name,
      applet.eventTriggerData.value,
      applet.eventConnection.value.connectionCredentials,
    );

    if (!applet.reactionConnection) return;

    const reactionPromises = [];
    for (const eventData of eventsData) {
      console.log('eventData', eventData);
      const reactionExecution = this.reactionService.executeReaction(
        applet.reactionConnection.value.application.name,
        applet.reaction.value.name,
        applet.reactionParametersData?.value,
        eventData,
        applet.reactionConnection.value.connectionCredentials,
      );
      reactionPromises.push(reactionExecution);
    }
    await Promise.all(reactionPromises);
  }
}
