import { EventEmitter2 } from '@nestjs/event-emitter';
import { Event } from './event-dispatcher.provider';
import { NodeEventDispatcher } from './node-event-dispatcher.provider';
import { expect, describe, beforeEach, it, jest } from '@jest/globals';

describe('NodeEventDispatcher', () => {
  let nodeEventDispatcher: NodeEventDispatcher;
  let mockEventEmitter: EventEmitter2;

  beforeEach(() => {
    mockEventEmitter = new EventEmitter2();
    mockEventEmitter.emit = jest.fn() as (
      event: string,
      ...values: any[]
    ) => boolean;

    nodeEventDispatcher = new NodeEventDispatcher(mockEventEmitter);
  });

  it('should dispatch an event correctly', async () => {
    const mockEvent = {
      getName: () => 'testEvent',
    } as unknown as Event;

    await nodeEventDispatcher.dispatch(mockEvent);

    expect(mockEventEmitter.emit).toHaveBeenCalledWith('testEvent', mockEvent);
  });
});
