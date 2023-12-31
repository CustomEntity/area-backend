/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-24
 **/
import { ICommand } from '@nestjs/cqrs';

export class RemoveUserConnectionCommand implements ICommand {
  constructor(public readonly userConnectionId: string) {}
}
