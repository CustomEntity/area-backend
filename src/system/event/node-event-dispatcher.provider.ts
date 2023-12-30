/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Injectable } from '@nestjs/common';
import { EventDispatcher } from './event-dispatcher.provider';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Event } from './event-dispatcher.provider';
import { UserConnectionCreatedEvent } from '../../features/user-connections/events/user-connection-created.event';

@Injectable()
export class NodeEventDispatcher implements EventDispatcher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  dispatch(event: Event): Promise<void> {
    this.eventEmitter.emit(event.getName(), event);
    return Promise.resolve();
  }
}
