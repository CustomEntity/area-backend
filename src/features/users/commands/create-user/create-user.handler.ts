/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { DateProvider } from '../../../../system/date/date.provider';
import { IdProvider } from '../../../../system/id/id.provider';
import { UserRepository } from '../../ports/user.repository';
import { User } from '../../entities/user.entity';
import { HashProvider } from '../../../../system/hash/hash.provider';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { Email } from '../../../../shared/value-objects/email.vo';
import { UserAlreadyExistsError } from '../../exceptions/user-already-exists.error';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dateProvider: DateProvider,
    private readonly idProvider: IdProvider,
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const user = await this.userRepository.findByEmail(command.email);

    if (user) {
      throw new UserAlreadyExistsError(command.email);
    }

    const hashedPassword = command.password
      ? await this.hashProvider.hash(command.password)
      : undefined;

    await this.userRepository.save(
      new User({
        id: command.id || this.idProvider.getId(),
        firstName: command.firstName,
        lastName: command.lastName,
        email: Email.create(command.email),
        isAdmin: false,
        hashedPassword: hashedPassword,
        createdAt: this.dateProvider.getDate(),
        profilePictureUrl: command.profilePictureUrl,
      }),
    );
  }
}
