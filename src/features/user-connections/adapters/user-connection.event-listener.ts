/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-13
 **/

import { OnEvent } from '@nestjs/event-emitter';
import { UserDeletedEvent } from '../../users/events/user-deleted.event';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteUserConnectionsCommand } from '../commands/delete-user-connections/delete-user-connections.command';

export class UserConnectionEventListener {
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent(UserDeletedEvent.name)
  async handleUserDeletedEvent(event: UserDeletedEvent) {
    return await this.commandBus.execute(
      new DeleteUserConnectionsCommand(event.id),
    );
  }
}
