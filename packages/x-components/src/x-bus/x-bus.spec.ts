import type { AnyFunction, Dictionary } from '@empathyco/x-utils'
import type { XBus, XPriorityQueueNodeData } from './x-bus.types'
import { BaseXPriorityQueue } from '../x-bus/x-priority-queue'
import { XPriorityBus } from './x-bus'

describe('x-priority-bus scenarios', () => {
  interface TestEvents {
    TestEvent1: string
    TestEvent2: number
    EventTest3: boolean
    EventTest4: void
  }

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('emit', () => {
    it('emits events in the right order', async () => {
      interface AnotherTestEvents {
        LastOne: void
        MiddleOne: void
        FirstOne: void
      }

      // Given a bus
      const bus = new XPriorityBus<AnotherTestEvents, Dictionary>({
        priorities: {
          Last: 0,
          Middle: 5,
          First: 10,
        },
      })

      // Then events are emitted
      const emittedEvents: (keyof AnotherTestEvents)[] = []
      await emitMultipleEvents<AnotherTestEvents, Dictionary>(
        bus,
        [
          ['LastOne', undefined, undefined],
          ['MiddleOne', undefined, undefined],
          ['FirstOne', undefined, undefined],
        ],
        emittedEvents,
      )
      expect(emittedEvents).toEqual<(keyof AnotherTestEvents)[]>([
        'FirstOne',
        'MiddleOne',
        'LastOne',
      ])
    })

    it('restarts an ongoing queue flushing whenever a new event is emitted', async () => {
      // Given a priority bus
      interface EventMetadata {
        priority: number
      }

      const queue = new BaseXPriorityQueue<
        TestEvents,
        XPriorityQueueNodeData<TestEvents, EventMetadata>
      >()
      const bus = new XPriorityBus<TestEvents, EventMetadata>({
        queue,
      })
      const emittedEvents: (keyof TestEvents)[] = []
      const pushEmittedEvent: AnyFunction = ({ event }: { event: keyof TestEvents }) =>
        emittedEvents.push(event)
      const queuePopSpy = jest.spyOn(queue, 'pop')

      // When multiple events are emitted at the same time
      // Then they're added to the queue
      // And cancel an ongoing flushing of the queue
      expect(queue.isEmpty()).toBe(true)

      const emit1 = bus.emit('TestEvent1', undefined, { priority: 4 }).then(pushEmittedEvent)
      expect(queue.size()).toBe(1)
      expect(queuePopSpy).not.toHaveBeenCalled()

      const emit2 = bus.emit('TestEvent2', undefined, { priority: 0 }).then(pushEmittedEvent)
      expect(queue.size()).toBe(2)
      expect(queuePopSpy).not.toHaveBeenCalled()

      const emit3 = bus.emit('EventTest3', undefined, { priority: 2 }).then(pushEmittedEvent)
      expect(queue.size()).toBe(3)
      expect(queuePopSpy).not.toHaveBeenCalled()

      const emit4 = bus.emit('EventTest4', undefined, { priority: 8 }).then(pushEmittedEvent)
      expect(queue.size()).toBe(4)
      expect(queuePopSpy).not.toHaveBeenCalled()

      // The events are batched and emitted in the right order
      jest.runAllTimers()
      await Promise.all([emit1, emit2, emit3, emit4])
      expect(queuePopSpy).toHaveBeenCalledTimes(4)
      expect(emittedEvents).toEqual<(keyof TestEvents)[]>([
        'EventTest4',
        'TestEvent1',
        'EventTest3',
        'TestEvent2',
      ])
      expect(queue.isEmpty()).toBe(true)
    })
  })

  describe('on', () => {
    it('allows to create subscriptions to an event', () => {
      // Given a bus
      const bus = new XPriorityBus<TestEvents, Dictionary>()

      // Then creates a subscription to an event
      const testEvent1SubscriptionFn = jest.fn()
      const testEvent2SubscriptionFn = jest.fn()
      bus.on('TestEvent1').subscribe(testEvent1SubscriptionFn)
      const unsubscribeFromTestEvent2 = bus.on('TestEvent2').subscribe(testEvent2SubscriptionFn)

      // When that event is emitted
      void bus.emit('TestEvent1')
      void bus.emit('TestEvent2')
      jest.runAllTimers()

      unsubscribeFromTestEvent2.unsubscribe()
      void bus.emit('TestEvent1')
      void bus.emit('TestEvent2')
      jest.runAllTimers()

      // Then the bus notify its subscriptions
      expect(testEvent1SubscriptionFn).toHaveBeenCalledTimes(2)
      expect(testEvent2SubscriptionFn).toHaveBeenCalledTimes(1)
    })

    it('allows to create subscriptions to an event with metadata', () => {
      interface EventMetadata {
        name: string
        isCustom: boolean
      }

      // Given a bus
      const bus = new XPriorityBus<TestEvents, EventMetadata>()

      // Then creates a subscription to an event
      const testEvent1SubscriptionFn = jest.fn()
      const testEvent2SubscriptionFn = jest.fn()
      bus.on('TestEvent1', true).subscribe(testEvent1SubscriptionFn)
      bus.on('TestEvent2', true).subscribe(testEvent2SubscriptionFn)

      // When that event is emitted
      void bus.emit('TestEvent1', 'string', { name: 'TestEvent1', isCustom: true })
      void bus.emit('TestEvent2', 0, { name: 'TestEvent2', isCustom: false })
      jest.runAllTimers()

      // Then the bus notify its subscriptions
      expect(testEvent1SubscriptionFn).toHaveBeenCalledTimes(1)
      expect(testEvent1SubscriptionFn).toHaveBeenCalledWith({
        eventPayload: 'string',
        metadata: { name: 'TestEvent1', isCustom: true },
      })
      expect(testEvent2SubscriptionFn).toHaveBeenCalledTimes(1)
      expect(testEvent2SubscriptionFn).toHaveBeenCalledWith({
        eventPayload: 0,
        metadata: { name: 'TestEvent2', isCustom: false },
      })
    })
  })
})

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
  emittedEvents: (keyof SomeRecord)[] = [],
): Promise<any[]> {
  const pushEmittedEvent: AnyFunction = ({ event }: { event: keyof SomeRecord }) =>
    emittedEvents.push(event)
  const emittedEventsPromise = Promise.all([
    // eslint-disable-next-line array-callback-return
    eventsToEmit.map(([event, payload, metadata]) => {
      void bus.emit(event, payload, metadata).then(pushEmittedEvent)
    }),
  ])

  jest.runAllTimers()

  return emittedEventsPromise
}
