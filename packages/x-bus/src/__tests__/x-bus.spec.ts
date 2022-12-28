import { XPriorityQueue } from '@empathyco/x-priority-queue';
import { XPriorityBus } from '../index';

describe('x-bus with priority queue', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('accepts an XPriorityQueue as constructor parameter', () => {
    const priorityQueue = new XPriorityQueue();
    const bus = new XPriorityBus(priorityQueue);

    bus.emit('stub').then(() => {
      expect(true).toBe(true);
    });
    jest.runAllTimers();
  });

  it('emits events that are resolved', () => {
    const bus = new XPriorityBus();

    bus.emit('stub').then(() => {
      expect(true).toBe(true);
    });
    jest.runAllTimers();
  });

  it('all the events in the queue are emitted', () => {
    const priorityQueue = new XPriorityQueue();
    const bus = new XPriorityBus(priorityQueue);

    bus.emit('stub1');

    bus.emit('stub2');

    expect(priorityQueue.size()).toBe(2);

    jest.runAllTimers();

    expect(priorityQueue.isEmpty()).toBe(true);
  });

  it('emitted events resolve by priority order', () => {
    const bus = new XPriorityBus();

    const resolvedEvents: string[] = [];

    bus.emit('DataChanged').then(event => {
      resolvedEvents.push(event);
      expect(resolvedEvents[1]).toBe('DataChanged');
    });

    bus.emit('RequestChanged').then(event => {
      resolvedEvents.push(event);
      expect(resolvedEvents[0]).toBe('RequestChanged');
    });

    jest.runAllTimers();
  });

  it('can override the priority behavior', () => {
    const bus = new XPriorityBus();

    const eventsPriorities = {
      stub2: 2,
      stub1: 4
    };

    const resolvedEvents: string[] = [];

    bus.getEventPriority = (event: 'stub1' | 'stub2') => {
      return eventsPriorities[event];
    };

    bus.emit('stub1').then(event => {
      resolvedEvents.push(event);
      expect(resolvedEvents[1]).toBe('stub1');
    });

    bus.emit('stub2').then(event => {
      resolvedEvents.push(event);
      expect(resolvedEvents[0]).toBe('stub2');
    });

    jest.runAllTimers();
  });
});
