import { Aes256EncryptionProvider } from './aes256-encryption.provider';
import { ConfigService } from '@nestjs/config';
import { expect, describe, beforeEach, it, jest } from '@jest/globals';

describe('Aes256EncryptionProvider', () => {
  let aes256EncryptionProvider: Aes256EncryptionProvider;
  let mockConfigService: ConfigService;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'encryptionSecretKey')
          return 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
        if (key === 'encryptionSecretIV')
          return '08c4bdc5ebab3567ef2c9e8c9f9e9e9e';
      }),
    } as unknown as ConfigService;

    aes256EncryptionProvider = new Aes256EncryptionProvider(mockConfigService);
  });

  it('should encrypt and decrypt a string correctly', () => {
    const testString = 'Hello, World!';
    const encryptedString = aes256EncryptionProvider.encrypt(testString);
    const decryptedString = aes256EncryptionProvider.decrypt(encryptedString);

    expect(decryptedString).toBe(testString);
  });
});
