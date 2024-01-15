import { FindUserByIdHandler } from '../queries/find-user-by-id/find-user-by-id.handler';
import { UserQueryRepository } from '../ports/user.query-repository';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { InMemoryUserQueryRepository } from '../adapters/in-memory.user-query-repository';
import { FindUserByIdQuery } from '../queries/find-user-by-id/find-user-by-id.query';
import { User } from '../entities/user.entity';
import { Email } from '../../../shared/value-objects/email.vo';

describe('FindUserByIdHandler', () => {
  let handler: FindUserByIdHandler;
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

    handler = new FindUserByIdHandler(userQueryRepository);
  });

  it('should find a user by id', async () => {
    const query = new FindUserByIdQuery('123');

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
    const query = new FindUserByIdQuery('nonexistent');

    const result = await handler.execute(query);

    expect(result).toBeNull();
  });
});
