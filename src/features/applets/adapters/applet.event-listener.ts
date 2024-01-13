/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-24
 **/

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserConnectionDeletedEvent } from '../../user-connections/events/user-connection-deleted.event';
import { CommandBus } from '@nestjs/cqrs';
import { RemoveUserConnectionCommand } from '../commands/remove-user-connection/remove-user-connection.command';
import { UserDeletedEvent } from '../../users/events/user-deleted.event';
import { DeleteUserAppletsCommand } from '../commands/delete-user-applets/delete-user-applets.command';

@Injectable()
export class AppletEventListener {
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent(UserConnectionDeletedEvent.name)
  async handleUserConnectionDeletedEvent(event: UserConnectionDeletedEvent) {
    await this.commandBus.execute(new RemoveUserConnectionCommand(event.id));
  }

  @OnEvent(UserDeletedEvent.name)
  async handleUserDeletedEvent(event: UserDeletedEvent) {
    await this.commandBus.execute(new DeleteUserAppletsCommand(event.id));
  }
}
