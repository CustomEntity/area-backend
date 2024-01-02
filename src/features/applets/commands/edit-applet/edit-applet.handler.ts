/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-02
 **/

import { EditAppletCommand } from './edit-applet.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppletRepository } from '../../ports/applet.repository';
import { DomainError } from '../../../../shared/domain-error';
import { TriggerData } from '../../value-objects/trigger-data.vo';
import { ReactionParametersData } from '../../value-objects/reaction-parameters-data.vo';

@CommandHandler(EditAppletCommand)
export class EditAppletHandler implements ICommandHandler<EditAppletCommand> {
  constructor(private readonly appletRepository: AppletRepository) {}

  async execute(command: EditAppletCommand) {
    const params = command.params;
    const applet = await this.appletRepository.findById(params.id);

    if (applet === null) {
      throw new DomainError(
        'NotFound',
        'APPLET_NOT_FOUND',
        `Applet with id '${params.id}' not found`,
      );
    }

    if (params.name !== undefined) {
      applet.name = params.name;
    }
    if (params.description !== undefined) {
      applet.description = params.description;
    }
    if (params.eventId !== undefined) {
      applet.eventId = params.eventId;
    }
    if (params.reactionId !== undefined) {
      applet.reactionId = params.reactionId;
    }
    if (params.eventConnectionId !== undefined) {
      applet.eventConnectionId = params.eventConnectionId;
    }
    if (params.reactionConnectionId !== undefined) {
      applet.reactionConnectionId = params.reactionConnectionId;
    }
    if (params.eventTriggerData !== undefined) {
      applet.eventTriggerData = TriggerData.create(params.eventTriggerData);
    }
    if (params.reactionParametersData !== undefined) {
      applet.reactionParametersData = ReactionParametersData.create(
        params.reactionParametersData,
      );
    }
  }
}
