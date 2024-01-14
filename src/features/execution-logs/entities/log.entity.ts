/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { Entity } from '../../../shared/entity';
import { LogLevel } from '../value-objects/log-level';

export type LogData = {
  id: string;
  executionLogId: string;
  logLevel: LogLevel;
  message: string;
  logDate: Date;
};

export class Log extends Entity<LogData> {
  get id(): string {
    return this.data.id;
  }

  get executionLogId(): string {
    return this.data.executionLogId;
  }

  get level(): LogLevel {
    return this.data.logLevel;
  }

  get message(): string {
    return this.data.message;
  }

  get logDate(): Date {
    return this.data.logDate;
  }
}
