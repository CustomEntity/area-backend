/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-13
 **/

import { DeleteUserCommand } from './delete-user.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../ports/user.repository';
import { UserDoesNotExistError } from '../../exceptions/user-does-not-exist.error';
import { EventDispatcher } from '../../../../system/event/event-dispatcher.provider';
import { UserDeletedEvent } from '../../events/user-deleted.event';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly repository: UserRepository,
    private readonly eventDispatcher: EventDispatcher,
  ) {}

  async execute(command: DeleteUserCommand) {
    const { id } = command;
    const user = await this.repository.findById(id);
    if (!user) {
      throw new UserDoesNotExistError(id);
    }

    await this.repository.delete(id);
    await this.eventDispatcher.dispatch(new UserDeletedEvent(id));
  }
}
