/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-30
 **/
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAppletCommand } from './create-applet.command';
import { ApplicationEventRepository } from '../../../applications/events/ports/application-event.repository';
import { UserConnectionRepository } from '../../../user-connections/ports/user-connection.repository';
import { DomainError } from '../../../../shared/domain-error';
import { IdProvider } from '../../../../system/id/id.provider';
import { TriggerData } from '../../value-objects/trigger-data.vo';
import { ReactionParametersData } from '../../value-objects/reaction-parameters-data.vo';
import { AppletRepository } from '../../ports/applet.repository';
import { Applet } from '../../entities/applet.entity';
import { ApplicationReactionRepository } from '../../../applications/reactions/ports/application-reaction.repository';

@CommandHandler(CreateAppletCommand)
export class CreateAppletHandler
  implements ICommandHandler<CreateAppletCommand>
{
  constructor(
    private readonly appletRepository: AppletRepository,
    private readonly eventRepository: ApplicationEventRepository,
    private readonly reactionRepository: ApplicationReactionRepository,
    private readonly userConnectionRepository: UserConnectionRepository,
    private readonly idProvider: IdProvider,
  ) {}

  async execute(command: CreateAppletCommand) {
    const event = await this.eventRepository.findById(command.eventId);
    if (!event) {
      throw new DomainError('NotFound', 'EVENT_NOT_FOUND', 'Event not found');
    }
    const reaction = await this.reactionRepository.findById(command.reactionId);
    if (!reaction) {
      throw new DomainError(
        'NotFound',
        'REACTION_NOT_FOUND',
        'Reaction not found',
      );
    }

    const eventConnection = await this.userConnectionRepository.findById(
      command.eventConnectionId,
    );
    if (!eventConnection) {
      throw new DomainError(
        'NotFound',
        'EVENT_CONNECTION_NOT_FOUND',
        'Event connection not found',
      );
    }

    const reactionConnection = await this.userConnectionRepository.findById(
      command.reactionConnectionId,
    );
    if (!reactionConnection) {
      throw new DomainError(
        'NotFound',
        'REACTION_CONNECTION_NOT_FOUND',
        'Reaction connection not found',
      );
    }

    if (event.data.triggerMapping.value && command.eventTriggerData) {
      for (const [key, value] of Object.entries(
        event.data.triggerMapping.value,
      )) {
        if (value.required && !command.eventTriggerData[key]) {
          throw new DomainError(
            'InvalidArgument',
            'MISSING_REQUIRED_FIELD',
            `Missing required field '${key}' in eventTriggerData`,
          );
        }
      }
    }

    if (reaction.data.parametersMapping.value && command.reactionActionData) {
      for (const [key, value] of Object.entries(
        reaction.data.parametersMapping.value,
      )) {
        if (value.required && !command.reactionActionData[key]) {
          throw new DomainError(
            'InvalidArgument',
            'MISSING_REQUIRED_FIELD',
            `Missing required field '${key}' in reactionActionData`,
          );
        }
      }
    }

    const applet = new Applet({
      id: this.idProvider.getId(),
      userId: command.userId,
      eventId: command.eventId,
      eventTriggerData: TriggerData.create(command.eventTriggerData),
      eventConnectionId: command.eventConnectionId,
      reactionId: command.reactionId,
      reactionActionData: ReactionParametersData.create(
        command.reactionActionData,
      ),
      reactionConnectionId: command.reactionConnectionId,
      name: command.name,
      description: command.description,
      active: true,
      createdAt: new Date(),
    });

    await this.appletRepository.save(applet);
  }
}
