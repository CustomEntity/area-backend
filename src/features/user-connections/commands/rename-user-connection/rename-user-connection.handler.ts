/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserConnectionRepository } from '../../ports/user-connection.repository';
import { EventDispatcher } from '../../../../system/event/event-dispatcher.provider';
import { UserConnectionDoesNotExistError } from '../../exceptions/user-connection-does-not-exist.error';
import { CannotAccessOtherConnectionError } from '../../exceptions/cannot-access-other-connection.error';
import { RenameUserConnectionCommand } from './rename-user-connection.command';

@CommandHandler(RenameUserConnectionCommand)
export class RenameUserConnectionHandler
  implements ICommandHandler<RenameUserConnectionCommand>
{
  constructor(
    private readonly userConnectionRepository: UserConnectionRepository,
    private readonly eventDispatcher: EventDispatcher,
  ) {}

  async execute(command: RenameUserConnectionCommand): Promise<void> {
    const userConnection = await this.userConnectionRepository.findById(
      command.id,
    );

    if (!userConnection) {
      throw new UserConnectionDoesNotExistError(command.id);
    }
    if (userConnection.userId !== command.userId) {
      throw new CannotAccessOtherConnectionError();
    }

    userConnection.name = command.name;

    await this.userConnectionRepository.save(userConnection);
  }
}
