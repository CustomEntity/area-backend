import { beforeEach, describe, expect, it } from '@jest/globals';
import { InMemoryUserQueryRepository } from '../adapters/in-memory.user-query-repository';
import { FindUserByEmailQuery } from '../queries/find-user-by-email/find-user-by-email.query';
import { FindUserByEmailHandler } from '../queries/find-user-by-email/find-user-by-email.handler';
import { UserQueryRepository } from '../ports/user.query-repository';
import { Email } from '../../../shared/value-objects/email.vo';
import { User } from '../entities/user.entity';

describe('FindUserByEmailHandler', () => {
  let handler: FindUserByEmailHandler;
  let userQueryRepository: UserQueryRepository;

  beforeEach(() => {
    userQueryRepository = new InMemoryUserQueryRepository([
      new User({
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: Email.create('john.doe@gmail.com'),
        isAdmin: false,
        createdAt: new Date(),
      }),
    ]);

    handler = new FindUserByEmailHandler(userQueryRepository);
  });

  it('should find a user by email', async () => {
    const query = new FindUserByEmailQuery('john.doe@gmail.com');

    const result = await handler.execute(query);

    expect(result).toEqual({
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
      createdAt: expect.any(Date),
    });
  });

  it('should return null if user not found', async () => {
    const query = new FindUserByEmailQuery('nonexistent@gmail.com');

    const result = await handler.execute(query);

    expect(result).toBeNull();
  });
});
