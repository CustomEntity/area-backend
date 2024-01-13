/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { ICommand } from '@nestjs/cqrs';

export class DeleteUserAppletsCommand implements ICommand {
  constructor(public readonly userId: string) {}
}
