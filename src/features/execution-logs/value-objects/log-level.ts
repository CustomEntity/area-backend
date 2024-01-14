/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { z } from 'zod';
import { ValueObject } from '../../../shared/value-object';

const LogLevelMapping = {
  DEBUG: 1,
  INFO: 2,
  WARNING: 3,
  ERROR: 4,
  CRITICAL: 5,
};

export const LogLevelData = z
  .number()
  .refine((value) => Object.values(LogLevelMapping).includes(value), {
    message: 'Invalid log level',
  });

export type LogLevelType = z.infer<typeof LogLevelData>;

export class LogLevel extends ValueObject<LogLevelType> {
  private constructor(value: LogLevelType) {
    super(value);
  }

  public static create(value: unknown): LogLevel {
    const parsedData = LogLevelData.parse(value);
    return new LogLevel(parsedData);
  }

  public toString(): string {
    return Object.keys(LogLevelMapping).find(
      (key) =>
        LogLevelMapping[key as keyof typeof LogLevelMapping] === this.value,
    ) as string;
  }
}
