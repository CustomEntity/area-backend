import { CurrentDateProvider } from './current-date.provider';
import { expect, describe, beforeEach, it } from '@jest/globals';

describe('CurrentDateProvider', () => {
  let currentDateProvider: CurrentDateProvider;

  beforeEach(() => {
    currentDateProvider = new CurrentDateProvider();
  });

  it('should return a Date object', () => {
    expect(currentDateProvider.getDate()).toBeInstanceOf(Date);
  });

  it('should return the current date and time', () => {
    const now = new Date();
    const dateFromProvider = currentDateProvider.getDate();
    const timeDifference = Math.abs(dateFromProvider.getTime() - now.getTime());

    expect(timeDifference).toBeLessThan(1000);
  });
});
