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
import { EncryptionProvider } from '../../../../system/encryption/encryption.provider';
import { ConnectionCredentialsSchema } from '../../../user-connections/value-objects/connection-credentials.vo';
import { z } from 'zod';

@CommandHandler(ExecuteAppletCommand)
export class ExecuteAppletHandler
  implements ICommandHandler<ExecuteAppletCommand>
{
  constructor(
    public readonly appletRepository: DetailedAppletRepository,
    public readonly eventService: EventService,
    public readonly reactionService: ReactionService,
    public readonly encryptionProvider: EncryptionProvider,
  ) {}

  decryptObjectFields(obj: Record<string, any>): Record<string, any> {
    const decryptedObject: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        decryptedObject[key] = this.encryptionProvider.decrypt(value);
      } else {
        decryptedObject[key] = value;
      }
    }

    return decryptedObject;
  }

  async execute(command: ExecuteAppletCommand): Promise<void> {
    const appletId = command.appletId;

    const applet = await this.appletRepository.findById(appletId);
    if (!applet) {
      console.error(`Applet with id ${appletId} not found`);
      return;
    }

    const eventsData = await this.eventService.retrieveNewEventsData(
      applet.id,
      applet.event.value.application.name,
      applet.event.value.name,
      applet.eventTriggerData?.value ?? {},
      this.decryptObjectFields(
        applet.eventConnection?.value.connectionCredentials ?? {},
      ) as z.infer<typeof ConnectionCredentialsSchema>,
    );

    console.log('eventsData', eventsData);

    const reactionPromises = [];
    for (const eventData of eventsData) {
      const reactionExecution = this.reactionService.executeReaction(
        applet.reaction.value.application.name,
        applet.reaction.value.name,
        eventData,
        applet.reactionParametersData?.value,
        this.decryptObjectFields(
          applet.reactionConnection?.value.connectionCredentials ?? {},
        ) as z.infer<typeof ConnectionCredentialsSchema>,
      );

      reactionPromises.push(reactionExecution);
    }
    await Promise.all(reactionPromises);
  }
}
