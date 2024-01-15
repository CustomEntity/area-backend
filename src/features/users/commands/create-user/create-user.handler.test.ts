import { CreateUserHandler } from './create-user.handler';
import { UserRepository } from '../../ports/user.repository';
import { DateProvider } from '../../../../system/date/date.provider';
import { IdProvider } from '../../../../system/id/id.provider';
import { HashProvider } from '../../../../system/hash/hash.provider';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CreateUserCommand } from './create-user.command';
import { UserAlreadyExistsError } from '../../exceptions/user-already-exists.error';
import { CurrentDateProvider } from '../../../../system/date/current-date.provider';
import { SnowflakeIdProvider } from '../../../../system/id/snowflake.provider';
import { InMemoryUserRepository } from '../../adapters/in-memory.user-repository';
import { ArgonHashProvider } from '../../../../system/hash/argon-hash.provider';
import { ConfigService } from '@nestjs/config';

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'systemEpoch') {
      return 1609459200000;
    }
    return undefined;
  }),
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn(() => mockConfigService),
}));

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let userRepository: UserRepository;
  let dateProvider: DateProvider;
  let idProvider: IdProvider;
  let hashProvider: HashProvider;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    dateProvider = new CurrentDateProvider();
    idProvider = new SnowflakeIdProvider(new ConfigService());
    hashProvider = new ArgonHashProvider();
    handler = new CreateUserHandler(
      userRepository,
      dateProvider,
      idProvider,
      hashProvider,
    );
  });

  it('should create a new user successfully', async () => {
    const command = new CreateUserCommand(
      'John',
      'Doe',
      'john@example.com',
      undefined,
      'password123',
    );
    await handler.execute(command);

    const createdUser = await userRepository.findByEmail('john@example.com');
    expect(createdUser).not.toBeNull();
    expect(createdUser?.firstName).toBe('John');
  });

  it('should throw an error if the user already exists', async () => {
    await handler.execute(
      new CreateUserCommand('Jane', 'Doe', 'jane@example.com'),
    );

    await expect(
      handler.execute(new CreateUserCommand('Jane', 'Doe', 'jane@example.com')),
    ).rejects.toThrow(UserAlreadyExistsError);
  });
});
