/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-13
 **/

import { EditUserCommand } from './edit-user.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../ports/user.repository';
import { UserDoesNotExistError } from '../../exceptions/user-does-not-exist.error';

@CommandHandler(EditUserCommand)
export class EditUserHandler implements ICommandHandler<EditUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: EditUserCommand): Promise<void> {
    const user = await this.userRepository.findById(command.id);

    if (!user) {
      throw new UserDoesNotExistError(command.id);
    }

    if (command.firstName) {
      user.firstName = command.firstName;
    }

    if (command.lastName) {
      user.lastName = command.lastName;
    }

    await this.userRepository.save(user);
  }
}
