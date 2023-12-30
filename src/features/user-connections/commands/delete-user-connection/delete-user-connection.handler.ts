/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserConnectionCommand } from './delete-user-connection.command';
import { UserConnectionRepository } from '../../ports/user-connection.repository';
import { EventDispatcher } from '../../../../system/event/event-dispatcher.provider';
import { UserConnectionDoesNotExistError } from '../../exceptions/user-connection-does-not-exist.error';
import { UserConnectionDeletedEvent } from '../../events/user-connection-deleted.event';
import { CannotAccessOtherConnectionError } from '../../exceptions/cannot-access-other-connection.error';

@CommandHandler(DeleteUserConnectionCommand)
export class DeleteUserConnectionHandler
  implements ICommandHandler<DeleteUserConnectionCommand>
{
  constructor(
    private readonly userConnectionRepository: UserConnectionRepository,
    private readonly eventDispatcher: EventDispatcher,
  ) {}

  async execute(command: DeleteUserConnectionCommand): Promise<void> {
    const userConnection = await this.userConnectionRepository.findById(
      command.id,
    );

    if (!userConnection) {
      throw new UserConnectionDoesNotExistError(command.id);
    }
    if (userConnection.userId !== command.userId) {
      throw new CannotAccessOtherConnectionError();
    }

    await this.userConnectionRepository.delete(userConnection);
    await this.eventDispatcher.dispatch(
      new UserConnectionDeletedEvent(
        userConnection.userId,
        userConnection.id,
        userConnection.applicationId,
        userConnection.name,
        userConnection.connectionCredentials.value,
      ),
    );
  }
}
