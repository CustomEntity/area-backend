import { EditUserHandler } from './edit-user.handler';
import { UserRepository } from '../../ports/user.repository';
import { EventDispatcher } from '../../../../system/event/event-dispatcher.provider';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { InMemoryUserRepository } from '../../adapters/in-memory.user-repository';
import { EditUserCommand } from './edit-user.command';
import { User } from '../../entities/user.entity';
import { Email } from '../../../../shared/value-objects/email.vo';

describe('EditUserHandler', () => {
  let handler: EditUserHandler;
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    handler = new EditUserHandler(userRepository);
  });

  it('should edit a user', async () => {
    const user = new User({
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: Email.create('john.doe@gmail.com'),
      isAdmin: false,
      createdAt: new Date(),
    });
    await userRepository.save(user);

    const updatedFirstName = 'UpdatedFirstName';
    const command = new EditUserCommand(user.id, updatedFirstName, undefined);
    await handler.execute(command);

    const updatedUser = await userRepository.findById(user.id);
    expect(updatedUser?.firstName).toEqual(updatedFirstName);
  });

  it('should throw an error if the user does not exist', async () => {
    const command = new EditUserCommand('123', 'UpdatedFirstName', undefined);
    await expect(handler.execute(command)).rejects.toThrow();
  });
});
