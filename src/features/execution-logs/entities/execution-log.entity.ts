/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { Entity } from '../../../shared/entity';

export type ExecutionLogData = {
  id: string;
  appletId: string;
  summary: string;
  executionDate: Date;
};

export class ExecutionLog extends Entity<ExecutionLogData> {
  get id(): string {
    return this.data.id;
  }

  get appletId(): string {
    return this.data.appletId;
  }

  get summary(): string {
    return this.data.summary;
  }

  get executionDate(): Date {
    return this.data.executionDate;
  }
}
