import { XPriorityQueue } from '@empathyco/x-priority-queue';
import { AnyFunction } from '@empathyco/x-utils';
import { XBus, XEvent } from '../x-bus.types';
import { XPriorityBus } from '../x-bus';

describe('x-priority-bus scenarios', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('constructor', () => {
    it('creates a bus with an existing priority queue', () => {
      // Given a custom bus initialization config
      const queue = new XPriorityQueue();
      const emitCallbackFn1: AnyFunction = jest.fn();
      const emitCallbackFn2: AnyFunction = jest.fn();
      const emitCallbacks = [emitCallbackFn1, emitCallbackFn2];

      // Then the provided configuration is used
      const bus = new XPriorityBus({
        queue,
        priorities: {
          TestEvent1: 10,
          TestEvent2: 0
        },
        emitCallbacks
      });
      bus.emit('TestEvent1');
      bus.emit('TestEvent2');

      expect(queue.size()).toBe(2);
      jest.runAllTimers();
      expect(queue.isEmpty()).toBe(true);
      emitCallbacks.forEach(callbackFn => {
        expect(callbackFn).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('emit', () => {
    it('emits events in the right order', async () => {
      // Given a bus
      const bus = new XPriorityBus({
        priorities: {
          '^StartsWith': 10,
          Contains: 5,
          EndsWith$: 0
        }
      });

      // Then events are emitted
      const emittedEvents: XEvent[] = [];
      await emitMultipleEvents(
        bus,
        [
          ['StartsWithIsTheLastOne', undefined, undefined],
          ['ContainsIsInTheMiddle', undefined, undefined],
          ['TheFirstOneEndsWith', undefined, undefined]
        ],
        emittedEvents
      );
      expect(emittedEvents).toEqual([
        'TheFirstOneEndsWith',
        'ContainsIsInTheMiddle',
        'StartsWithIsTheLastOne'
      ]);
    });

    it('restarts an ongoing queue flushing whenever a new event is emitted', async () => {
      // Given a priority bus
      const queue = new XPriorityQueue();
      const bus = new XPriorityBus({ queue });
      const emittedEvents: XEvent[] = [];
      const pushEmittedEvent: AnyFunction = ({ event }) => emittedEvents.push(event);

      // When multiple events are emitted at the same time
      // Then they're added to the queue
      // And cancel an ongoing flushing of the queue
      let pendingFlush = bus['pendingFlush'];
      expect(pendingFlush).toBeUndefined();
      expect(queue.isEmpty()).toBe(true);

      const emit1 = bus.emit('TestEvent1', undefined, { priority: 2 }).then(pushEmittedEvent);
      pendingFlush = bus['pendingFlush'];
      expect(pendingFlush).toBeDefined();
      expect(queue.size()).toBe(1);

      const emit2 = bus.emit('TestEvent2', undefined, { priority: 6 }).then(pushEmittedEvent);
      expect(pendingFlush).not.toBe(bus['pendingFlush']);
      pendingFlush = bus['pendingFlush'];
      expect(queue.size()).toBe(2);

      const emit3 = bus.emit('TestEvent3', undefined, { priority: 4 }).then(pushEmittedEvent);
      expect(pendingFlush).not.toBe(bus['pendingFlush']);
      pendingFlush = bus['pendingFlush'];
      expect(queue.size()).toBe(3);

      const emit4 = bus.emit('TestEvent4', undefined, { priority: 0 }).then(pushEmittedEvent);
      expect(pendingFlush).not.toBe(bus['pendingFlush']);
      expect(queue.size()).toBe(4);

      // The events are batched and emitted in the right order
      jest.runAllTimers();
      await Promise.all([emit1, emit2, emit3, emit4]);
      expect(emittedEvents).toEqual(['TestEvent4', 'TestEvent1', 'TestEvent3', 'TestEvent2']);
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('on', () => {
    it('allows to create subscriptions to an event', () => {
      // Given a bus
      const bus = new XPriorityBus();

      // Then creates a subscription to an event
      const testEventSubscriptionFn = jest.fn();
      const anotherTestEventSubscriptionFn = jest.fn();
      bus.on('TestEvent').subscribe(testEventSubscriptionFn);
      const anotherTestEventSubscription = bus
        .on('TestEvent')
        .subscribe(anotherTestEventSubscriptionFn);

      // When that event is emitted
      bus.emit('TestEvent');
      bus.emit('TestEvent');
      jest.runAllTimers();

      anotherTestEventSubscription.unsubscribe();
      bus.emit('TestEvent');
      jest.runAllTimers();

      // Then the bus notify its subscriptions
      expect(testEventSubscriptionFn).toHaveBeenCalledTimes(3);
      expect(anotherTestEventSubscriptionFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('getEventPriority', () => {
    it('can override the priority behavior', async () => {
      // Given a priority bus
      const bus = new XPriorityBus();

      // When the priority assignment function is overriden
      bus.getEventPriority = (event, metadata) => metadata.customPriority;

      // Then multiple events are emitted in the right order
      const emittedEvents: XEvent[] = [];
      await emitMultipleEvents(
        bus,
        [
          ['TestEvent1', undefined, { customPriority: 4 }],
          ['TestEvent2', undefined, { customPriority: 2 }],
          ['TestEvent3', undefined, { customPriority: 0 }]
        ],
        emittedEvents
      );
      expect(emittedEvents).toEqual(['TestEvent3', 'TestEvent2', 'TestEvent1']);
    });
  });
});

/**
 * Utility to emit multiple events and wait for them to be resolved.
 *
 * @param bus - The bus to emit the events to.
 * @param eventsToEmit - The events to emit.
 * @param emittedEvents - The array containing the emitted events.
 * @returns An array containing the emitted events in the right order.
 *
 * @internal
 */
async function emitMultipleEvents(
  bus: XPriorityBus,
  eventsToEmit: Parameters<XBus['emit']>[],
  emittedEvents: XEvent[] = []
): Promise<any[]> {
  const pushEmittedEvent: AnyFunction = ({ event }) => emittedEvents.push(event);
  const emittedEventsPromise = Promise.all([
    eventsToEmit.map(([event, payload, metadata]) => {
      bus.emit(event, payload, metadata).then(pushEmittedEvent);
    })
  ]);

  jest.runAllTimers();

  return await emittedEventsPromise;
}
