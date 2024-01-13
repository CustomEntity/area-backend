/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserConnectionsCommand } from './delete-user-connections.command';
import { UserConnectionRepository } from '../../ports/user-connection.repository';

@CommandHandler(DeleteUserConnectionsCommand)
export class DeleteUserConnectionsHandler
  implements ICommandHandler<DeleteUserConnectionsCommand>
{
  constructor(
    private readonly userConnectionRepository: UserConnectionRepository,
  ) {}

  async execute(command: DeleteUserConnectionsCommand): Promise<void> {
    await this.userConnectionRepository.deleteByUserId(command.userId);
  }
}
