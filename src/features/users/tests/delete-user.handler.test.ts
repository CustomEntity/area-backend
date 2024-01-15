import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { DeleteUserHandler } from '../commands/delete-user/delete-user.handler';
import { UserRepository } from '../ports/user.repository';
import { EventDispatcher } from '../../../system/event/event-dispatcher.provider';
import { InMemoryUserRepository } from '../adapters/in-memory.user-repository';
import { User } from '../entities/user.entity';
import { DeleteUserCommand } from '../commands/delete-user/delete-user.command';
import { UserDeletedEvent } from '../events/user-deleted.event';
import { Email } from '../../../shared/value-objects/email.vo';

describe('DeleteUserHandler', () => {
  let handler: DeleteUserHandler;
  let userRepository: UserRepository;
  let eventDispatcher: EventDispatcher;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    eventDispatcher = {
      dispatch: jest.fn(),
    } as EventDispatcher;
    handler = new DeleteUserHandler(userRepository, eventDispatcher);
  });

  it('should delete a user and dispatch UserDeletedEvent', async () => {
    const user = new User({
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: Email.create('john.doe@gmail.com'),
      isAdmin: false,
      createdAt: new Date(),
    });
    await userRepository.save(user);

    const command = new DeleteUserCommand(user.id);
    await handler.execute(command);

    const deletedUser = await userRepository.findById(user.id);
    expect(deletedUser).toBeNull();

    expect(eventDispatcher.dispatch).toHaveBeenCalledWith(
      new UserDeletedEvent(user.id),
    );
  });
});
