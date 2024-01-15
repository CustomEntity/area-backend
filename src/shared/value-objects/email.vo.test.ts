import { describe, expect, it } from '@jest/globals';
import { Email } from './email.vo';

describe('Email Value Object', () => {
  it('should create a valid Email object with a valid email address', () => {
    const validEmail = 'test@example.com';
    const emailObject = Email.create(validEmail);
    expect(emailObject).toBeInstanceOf(Email);
    expect(emailObject.value).toBe(validEmail);
  });

  it('should throw an error for an invalid email address', () => {
    const invalidEmail = 'not_a_valid_email';
    expect(() => Email.create(invalidEmail)).toThrow('Invalid email address');
  });

  it('should throw an error for a non-string value', () => {
    const nonString = 12345;
    expect(() => Email.create(nonString)).toThrow();
  });
});
