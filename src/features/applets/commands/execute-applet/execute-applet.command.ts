/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-19
 **/
import {ICommand} from "@nestjs/cqrs";

export class ExecuteAppletCommand implements ICommand {
    constructor(
        public readonly appletId: string
    ) {
    }
}