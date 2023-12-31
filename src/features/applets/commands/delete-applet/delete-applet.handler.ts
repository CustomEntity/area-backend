/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-31
 **/

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAppletCommand } from './delete-applet.command';
import { AppletRepository } from '../../ports/applet.repository';
import { DomainError } from '../../../../shared/domain-error';

@CommandHandler(DeleteAppletCommand)
export class DeleteAppletHandler
  implements ICommandHandler<DeleteAppletCommand>
{
  constructor(private readonly appletRepository: AppletRepository) {}

  async execute(command: DeleteAppletCommand) {
    const applet = await this.appletRepository.findById(command.appletId);

    if (!applet) {
      throw new DomainError('NotFound', 'APPLET_NOT_FOUND', 'Applet not found');
    }
    await this.appletRepository.delete(applet);
  }
}
