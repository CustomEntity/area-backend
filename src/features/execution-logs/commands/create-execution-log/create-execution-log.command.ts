/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-15
 **/
import { ICommand } from '@nestjs/cqrs';

export class CreateExecutionLogCommand implements ICommand {
  constructor(
    public readonly appletId: string,
    public readonly summary: string,
    public readonly executionDate: Date,
    public readonly id?: string,
  ) {}
}
