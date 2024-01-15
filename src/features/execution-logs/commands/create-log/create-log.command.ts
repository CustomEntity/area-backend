/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-15
 **/
import { ICommand } from '@nestjs/cqrs';

export class CreateLogCommand implements ICommand {
  constructor(
    public readonly executionLogId: string,
    public readonly level: number,
    public readonly message: string,
    public readonly logDate: Date,
    public readonly id?: string,
  ) {}
}
