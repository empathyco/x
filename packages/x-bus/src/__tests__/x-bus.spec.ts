import { XPriorityQueue } from '@empathyco/x-priority-queue';
import { AnyFunction } from '@empathyco/x-utils';
import { XEvent, XPriorityBus } from '../index';

describe('x-priority-bus scenarios', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('constructor', () => {
    it('creates a bus with an existing priority queue', async () => {
      // Given a priority queue
      const queue = new XPriorityQueue();
      // And a custom priorities object
      const priorities = {
        stub1: 0,
        stub2: 10,
        stub3: 5
      };
      //And an array with multiple emit callbacks
      const logEventName: AnyFunction = jest.fn();
      const logEventMetadata: AnyFunction = jest.fn();
      const emitCallbacks = [logEventName, logEventMetadata];

      const bus = new XPriorityBus({ queue, priorities, emitCallbacks });
      const emittedEvents: XEvent[] = [];

      const pushEmittedEvent: AnyFunction = ({ event }) => emittedEvents.push(event);
      const emittedEventsPromise = Promise.all([
        bus.emit('stub1').then(pushEmittedEvent),
        bus.emit('stub2').then(pushEmittedEvent),
        bus.emit('stub3').then(pushEmittedEvent)
      ]);

      // Then the provided configuration is used
      expect(queue.size()).toBe(3);

      jest.runAllTimers();

      await emittedEventsPromise;
      expect(emittedEvents).toEqual(['stub1', 'stub3', 'stub2']);
      emitCallbacks.forEach(callbackFn => {
        expect(callbackFn).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe('emit', () => {
    it('emits events in the right order', () => {
      // Given a bus
      const bus = new XPriorityBus();
      const resolvedEvents: XEvent[] = [];

      // When multiple events are emitted through it
      bus.emit('DataChanged').then(({ event }) => {
        resolvedEvents.push(event);
        expect(resolvedEvents[1]).toBe('DataChanged');
      });

      bus.emit('RequestChanged').then(({ event }) => {
        resolvedEvents.push(event);
        expect(resolvedEvents[0]).toBe('RequestChanged');
      });

      jest.runAllTimers();
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
      const pushEmittedEvent: AnyFunction = ({ event }) => emittedEvents.push(event);
      const emittedEventsPromise = Promise.all([
        bus.emit('stub1', undefined, { customPriority: 4 }).then(pushEmittedEvent),
        bus.emit('stub2', undefined, { customPriority: 2 }).then(pushEmittedEvent),
        bus.emit('stub3', undefined, { customPriority: 0 }).then(pushEmittedEvent)
      ]);

      jest.runAllTimers();

      await emittedEventsPromise;
      expect(emittedEvents).toEqual(['stub3', 'stub2', 'stub1']);
    });
  });
});
