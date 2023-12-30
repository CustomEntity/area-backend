/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-18
 **/
import { ICommand } from '@nestjs/cqrs';

export class ScheduleAppletExecutionCommand implements ICommand {
  constructor(public readonly appletId: string) {}
}
