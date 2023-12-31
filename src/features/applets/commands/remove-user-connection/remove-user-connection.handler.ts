/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-18
 **/
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveUserConnectionCommand } from './remove-user-connection.command';
import { AppletRepository } from '../../ports/applet.repository';

@CommandHandler(RemoveUserConnectionCommand)
export class RemoveUserConnectionHandler
  implements ICommandHandler<RemoveUserConnectionCommand>
{
  constructor(public readonly appletRepository: AppletRepository) {}

  async execute(command: RemoveUserConnectionCommand): Promise<void> {
    const applets = await this.appletRepository.findByUserConnectionId(
      command.userConnectionId,
    );

    for (const applet of applets) {
      applet.removeUserConnection(command.userConnectionId);

      await this.appletRepository.save(applet);
    }
  }
}
