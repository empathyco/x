import { BaseXPriorityQueue } from '@empathyco/x-priority-queue';
import { AnyFunction, Dictionary } from '@empathyco/x-utils';
import { XBus, XPriorityQueueNodeData } from '../x-bus.types';
import { XPriorityBus } from '../x-bus';

describe('x-priority-bus scenarios', () => {
  interface TestEvents {
    TestEvent1: string;
    TestEvent2: number;
    EventTest3: boolean;
    EventTest4: void;
  }

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('constructor', () => {
    it('creates a bus with an existing priority queue', () => {
      // Given a custom bus initialization config
      const queue = new BaseXPriorityQueue<
        TestEvents,
        XPriorityQueueNodeData<TestEvents, Dictionary>
      >();
      const emitCallbackFn1: AnyFunction = jest.fn();
      const emitCallbackFn2: AnyFunction = jest.fn();
      const emitCallbacks = [emitCallbackFn1, emitCallbackFn2];

      // Then the provided configuration is used
      const bus = new XPriorityBus<TestEvents, Dictionary>({
        queue,
        priorities: {
          '^TestEvent': 10,
          '^EventTest': 0
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
      interface AnotherTestEvents {
        LastOne: void;
        MiddleOne: void;
        FirstOne: void;
      }

      // Given a bus
      const bus = new XPriorityBus<AnotherTestEvents, Dictionary>({
        priorities: {
          Last: 0,
          Middle: 5,
          First: 10
        }
      });

      // Then events are emitted
      const emittedEvents: (keyof AnotherTestEvents)[] = [];
      await emitMultipleEvents<AnotherTestEvents, Dictionary>(
        bus,
        [
          ['LastOne', undefined, undefined],
          ['MiddleOne', undefined, undefined],
          ['FirstOne', undefined, undefined]
        ],
        emittedEvents
      );
      expect(emittedEvents).toEqual<(keyof AnotherTestEvents)[]>([
        'FirstOne',
        'MiddleOne',
        'LastOne'
      ]);
    });

    it('restarts an ongoing queue flushing whenever a new event is emitted', async () => {
      // Given a priority bus
      interface EventMetadata {
        priority: number;
      }

      const queue = new BaseXPriorityQueue<
        TestEvents,
        XPriorityQueueNodeData<TestEvents, EventMetadata>
      >();
      const bus = new XPriorityBus<TestEvents, EventMetadata>({
        queue
      });
      const emittedEvents: (keyof TestEvents)[] = [];
      const pushEmittedEvent: AnyFunction = ({ event }) => emittedEvents.push(event);

      // When multiple events are emitted at the same time
      // Then they're added to the queue
      // And cancel an ongoing flushing of the queue
      let pendingFlush = bus['pendingFlushId'];
      expect(pendingFlush).toBeUndefined();
      expect(queue.isEmpty()).toBe(true);

      const emit1 = bus.emit('TestEvent1', undefined, { priority: 4 }).then(pushEmittedEvent);
      pendingFlush = bus['pendingFlushId'];
      expect(pendingFlush).toBeDefined();
      expect(queue.size()).toBe(1);

      const emit2 = bus.emit('TestEvent2', undefined, { priority: 0 }).then(pushEmittedEvent);
      expect(pendingFlush).not.toBe(bus['pendingFlushId']);
      pendingFlush = bus['pendingFlushId'];
      expect(queue.size()).toBe(2);

      const emit3 = bus.emit('EventTest3', undefined, { priority: 2 }).then(pushEmittedEvent);
      expect(pendingFlush).not.toBe(bus['pendingFlushId']);
      pendingFlush = bus['pendingFlushId'];
      expect(queue.size()).toBe(3);

      const emit4 = bus.emit('EventTest4', undefined, { priority: 8 }).then(pushEmittedEvent);
      expect(pendingFlush).not.toBe(bus['pendingFlushId']);
      expect(queue.size()).toBe(4);

      // The events are batched and emitted in the right order
      jest.runAllTimers();
      await Promise.all([emit1, emit2, emit3, emit4]);
      expect(emittedEvents).toEqual<(keyof TestEvents)[]>([
        'EventTest4',
        'TestEvent1',
        'EventTest3',
        'TestEvent2'
      ]);
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('on', () => {
    it('allows to create subscriptions to an event', () => {
      // Given a bus
      const bus = new XPriorityBus<TestEvents, Dictionary>();

      // Then creates a subscription to an event
      const testEvent1SubscriptionFn = jest.fn();
      const testEvent2SubscriptionFn = jest.fn();
      bus.on('TestEvent1').subscribe(testEvent1SubscriptionFn);
      const unsubscribeFromTestEvent2 = bus.on('TestEvent2').subscribe(testEvent2SubscriptionFn);

      // When that event is emitted
      bus.emit('TestEvent1');
      bus.emit('TestEvent2');
      jest.runAllTimers();

      unsubscribeFromTestEvent2.unsubscribe();
      bus.emit('TestEvent1');
      bus.emit('TestEvent2');
      jest.runAllTimers();

      // Then the bus notify its subscriptions
      expect(testEvent1SubscriptionFn).toHaveBeenCalledTimes(2);
      expect(testEvent2SubscriptionFn).toHaveBeenCalledTimes(1);
    });

    it('allows to create subscriptions to an event with metadata', () => {
      interface EventMetadata {
        name: string;
        isCustom: boolean;
      }

      // Given a bus
      const bus = new XPriorityBus<TestEvents, EventMetadata>();

      // Then creates a subscription to an event
      const testEvent1SubscriptionFn = jest.fn();
      const testEvent2SubscriptionFn = jest.fn();
      bus.on('TestEvent1', true).subscribe(testEvent1SubscriptionFn);
      bus.on('TestEvent2', true).subscribe(testEvent2SubscriptionFn);

      // When that event is emitted
      bus.emit('TestEvent1', 'string', { name: 'TestEvent1', isCustom: true });
      bus.emit('TestEvent2', 0, { name: 'TestEvent2', isCustom: false });
      jest.runAllTimers();

      // Then the bus notify its subscriptions
      expect(testEvent1SubscriptionFn).toHaveBeenCalledTimes(1);
      expect(testEvent1SubscriptionFn).toHaveBeenCalledWith({
        eventPayload: 'string',
        metadata: { name: 'TestEvent1', isCustom: true }
      });
      expect(testEvent2SubscriptionFn).toHaveBeenCalledTimes(1);
      expect(testEvent2SubscriptionFn).toHaveBeenCalledWith({
        eventPayload: 0,
        metadata: { name: 'TestEvent2', isCustom: false }
      });
    });
  });

  describe('getEventPriority', () => {
    it('can override the priority behavior', async () => {
      interface EventMetadata {
        customPriority?: number;
      }

      // Given a priority bus
      const bus = new XPriorityBus<TestEvents, EventMetadata>();

      // When the priority assignment function is overridden
      bus['getEventPriority'] = (_, metadata) => metadata.customPriority ?? Number.MIN_SAFE_INTEGER;

      // Then multiple events are emitted in the right order
      const emittedEvents: (keyof TestEvents)[] = [];
      await emitMultipleEvents<TestEvents, EventMetadata>(
        bus,
        [
          ['TestEvent1', undefined, { customPriority: 0 }],
          ['TestEvent2', undefined, { customPriority: 2 }],
          ['EventTest3', undefined, { customPriority: 4 }],
          ['EventTest4', undefined, {}]
        ],
        emittedEvents
      );
      expect(emittedEvents).toEqual<(keyof TestEvents)[]>([
        'EventTest3',
        'TestEvent2',
        'TestEvent1',
        'EventTest4'
      ]);
    });
  });
});

/**
 * Utility to emit multiple events and wait for them to be resolved.
 *
 * @param bus - The bus to emit the events to.
 * @param eventsToEmit - The events to emit.
 * @param emittedEvents - The array containing the emitted events.
 *
 * @returns An array containing the emitted events in the right order.
 *
 * @internal
 */
async function emitMultipleEvents<SomeRecord extends Dictionary, SomeMetadata extends Dictionary>(
  bus: XPriorityBus<SomeRecord, SomeMetadata>,
  eventsToEmit: Parameters<XBus<SomeRecord, SomeMetadata>['emit']>[],
  emittedEvents: (keyof SomeRecord)[] = []
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
