/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserAppletsCommand } from './delete-user-applets.command';
import { AppletRepository } from '../../ports/applet.repository';

@CommandHandler(DeleteUserAppletsCommand)
export class DeleteUserAppletsHandler
  implements ICommandHandler<DeleteUserAppletsCommand>
{
  constructor(private readonly appletRepository: AppletRepository) {}

  async execute(command: DeleteUserAppletsCommand): Promise<void> {
    await this.appletRepository.deleteByUserId(command.userId);
  }
}
