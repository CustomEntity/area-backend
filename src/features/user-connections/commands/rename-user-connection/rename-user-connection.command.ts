/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { ICommand } from '@nestjs/cqrs';

export class RenameUserConnectionCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly name: string,
  ) {}
}
