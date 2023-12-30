/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-18
 **/
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppletRepository } from '../../ports/applet.repository';
import { RemoveUserConnectionCommand } from './remove-user-connection.command';

@CommandHandler(RemoveUserConnectionCommand)
export class RemoveUserConnectionHandler
  implements ICommandHandler<RemoveUserConnectionCommand>
{
  constructor(public readonly appletRepository: AppletRepository) {}

  async execute(command: RemoveUserConnectionCommand): Promise<void> {
    const applets = await this.appletRepository.findByUserConnectionId(
      command.userConnectionId,
    );

    console.log('applets', applets);

    for (const applet of applets) {
      applet.removeUserConnection(command.userConnectionId);

      await this.appletRepository.save(applet);
    }
  }
}
