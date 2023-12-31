/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-31
 **/
import { ICommand } from '@nestjs/cqrs';

export class DeleteAppletCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly appletId: string,
  ) {}
}
