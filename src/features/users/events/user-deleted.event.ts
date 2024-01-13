/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Event } from '../../../system/event/event-dispatcher.provider';

export class UserDeletedEvent implements Event {
  constructor(public readonly id: string) {}

  getName(): string {
    return UserDeletedEvent.name;
  }
}
