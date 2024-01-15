import { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { SnowflakeIdProvider } from './snowflake.provider';

jest.mock('snowflakify', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    nextId: jest.fn(() => 1234567890),
  })),
}));

describe('SnowflakeIdProvider', () => {
  let snowflakeIdProvider: SnowflakeIdProvider;
  let mockConfigService: ConfigService;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn().mockReturnValue('mock_epoch'),
    } as unknown as ConfigService;

    snowflakeIdProvider = new SnowflakeIdProvider(mockConfigService);
  });

  it('should return an ID as a string', () => {
    const id = snowflakeIdProvider.getId();
    expect(id).toBe('1234567890');
    expect(typeof id).toBe('string');
  });
});
