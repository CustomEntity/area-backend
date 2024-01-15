/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-18
 **/
import { Injectable } from '@nestjs/common';
import { Consumer } from '../../../core/decorators/consumer.decorator';
import { DetailedApplet } from '../entities/detailed-applet.entity';
import { DetailedAppletRepository } from '../ports/detailed-applet.repository';
import { CommandBus } from '@nestjs/cqrs';
import { ExecuteAppletCommand } from '../commands/execute-applet/execute-applet.command';

@Injectable()
export class AppletConsumer {
  constructor(private readonly commandBus: CommandBus) {}

  @Consumer('applet-execution')
  async handleAppletExecution(message: { appletId: string }): Promise<void> {
    //await this.commandBus.execute(new ExecuteAppletCommand(message.appletId));
  }
}
