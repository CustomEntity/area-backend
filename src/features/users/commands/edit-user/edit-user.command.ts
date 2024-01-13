/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-13
 **/
import { ICommand } from '@nestjs/cqrs';

export class EditUserCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
  ) {}
}
