/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserConnectionCommand } from './delete-user-connection.command';
import { UserConnectionRepository } from '../../ports/user-connection.repository';
import { DateProvider } from '../../../../system/date/date.provider';
import { IdProvider } from '../../../../system/id/id.provider';
import { UserConnection } from '../../entities/user-connection.entity';
import { ConnectionCredentials } from '../../value-objects/connection-credentials.vo';
import { ApplicationRepository } from '../../../applications/core/ports/application.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { ApplicationDoesNotExistError } from '../../../applications/core/exceptions/application-does-not-exist.error';
import { EventDispatcher } from '../../../../system/event/event-dispatcher.provider';
import { UserConnectionCreatedEvent } from '../../events/user-connection-created.event';

@CommandHandler(DeleteUserConnectionCommand)
export class CreateUserConnectionHandler
  implements ICommandHandler<DeleteUserConnectionCommand>
{
  constructor(
    private readonly userConnectionRepository: UserConnectionRepository,
    private readonly dateProvider: DateProvider,
    private readonly idProvider: IdProvider,
    private readonly eventDispatcher: EventDispatcher,
  ) {}

  async execute(command: DeleteUserConnectionCommand): Promise<void> {
    const id = this.idProvider.getId();
    const userConnection = new UserConnection({
      id,
      userId: command.userId,
      applicationId: command.applicationId,
      name: command.name,
      connectionCredentials: ConnectionCredentials.create(
        command.connectionCredentials,
      ),
      createdAt: this.dateProvider.getDate(),
    });

    await this.userConnectionRepository.save(userConnection);

    await this.eventDispatcher.dispatch(
      new UserConnectionCreatedEvent(
        command.userId,
        id,
        command.applicationName,
        command.connectionCredentials,
      ),
    );
  }
}
