import type { XPriorityQueueNode } from './x-priority-queue.types'
import { BaseXPriorityQueue } from './x-priority-queue'

describe('x-priority-queue scenarios', () => {
  interface QueueRecord {
    First: any
    Second: any
    Third: any
    Fourth: any
    Fifth: any
  }

  describe('constructor', () => {
    it('uses the comparator function passed to the constructor to sort the queue', () => {
      // Given a queue passing a comparator function to its constructor
      const queue = new BaseXPriorityQueue<QueueRecord>((a, b) => a > b)

      // And elements are inserted
      queue.push('First', 30)
      queue.push('Second', 20)
      queue.push('Third', 10)

      // Then the order of the elements is sorted by the passed comparator function
      expect(queue.keys).toEqual(['Third', 'Second', 'First'])
    })
  })

  describe('push', () => {
    it('inserts an element when the queue is empty', () => {
      interface QueueNodeData {
        property: string
      }

      // Given an empty priority queue
      const queue = new BaseXPriorityQueue<QueueRecord, QueueNodeData>()

      // And an element is pushed
      const key = 'First'
      const priority = 10
      const data = { property: 'value' }
      queue.push(key, 10, data)

      // Then the element is inserted at the first position
      const insertedElement = queue.at(0)
      expect(insertedElement).toEqual<XPriorityQueueNode<QueueRecord, QueueNodeData>>({
        key,
        priority,
        data,
      })
    })

    it('inserts an element when the queue is not empty', () => {
      // Given a priority queue with elements
      const queue = new BaseXPriorityQueue<QueueRecord>()
      queue.push('First', 30)
      queue.push('Second', 20)
      queue.push('Third', 10)

      // And elements are pushed
      queue.push('Fourth', 0)
      queue.push('Fifth', 25)

      // Then each element is inserted at the correct position
      expect(queue.keys).toEqual<(keyof QueueRecord)[]>([
        'First',
        'Fifth',
        'Second',
        'Third',
        'Fourth',
      ])
    })

    it('inserts an element with the same key as an already existing non-replaceable element', () => {
      interface QueueNodeData {
        previous: boolean
      }

      // Given a priority queue with non-replaceable elements
      const queue = new BaseXPriorityQueue<QueueRecord, QueueNodeData>()
      queue.push('First', 30, { previous: true })
      queue.push('Second', 20)
      queue.push('Third', 10)

      // And an element with an existing key is inserted
      queue.push('First', 30, { previous: false })

      // Then the element is inserted without removing the other one
      const existingElement = queue.at(0)
      const newElement = queue.at(1)

      expect(existingElement).toEqual<XPriorityQueueNode<QueueRecord, QueueNodeData>>({
        key: 'First',
        priority: 30,
        data: { previous: true },
      })
      expect(newElement).toEqual<XPriorityQueueNode<QueueRecord, QueueNodeData>>({
        key: 'First',
        priority: 30,
        data: { previous: false },
      })
    })

    it('inserts an element with the same key as an already existing and replaceable element', () => {
      interface QueueNodeData {
        replaceable: true
      }

      // Given a priority queue with replaceable elements
      const queue = new BaseXPriorityQueue<QueueRecord, QueueNodeData>()
      queue.push('First', 30, { replaceable: true })
      queue.push('Second', 20)
      queue.push('Third', 10)

      // And an element with an existing key is inserted
      queue.push('First', 5)

      // Then the existing element is removed and the new one is inserted at the correct position
      expect(queue.keys).toEqual<(keyof QueueRecord)[]>(['Second', 'Third', 'First'])
    })
  })

  describe('pop', () => {
    it('does not remove anything when the queue is empty', () => {
      // Given an empty priority queue
      const queue = new BaseXPriorityQueue()

      // And an element is popped
      // Then nothing is removed
      expect(queue.pop()).toBeUndefined()
    })

    it('removes and retrieves the first element of the queue when it is not empty', () => {
      // Given a priority queue with elements
      const queue = new BaseXPriorityQueue<QueueRecord>()
      queue.push('Third', 10)
      queue.push('First', 30)
      queue.push('Second', 20)

      // And an element is popped
      // Then the first element is removed and retrieved
      expect(queue.pop()).toEqual<XPriorityQueueNode<QueueRecord>>({
        key: 'First',
        priority: 30,
        data: {},
      })
      expect(queue.keys).toEqual(['Second', 'Third'])
    })
  })

  describe('peek', () => {
    it('returns the first element of the queue without removing it', () => {
      // Given an empty queue
      const queue = new BaseXPriorityQueue<QueueRecord>()

      // And an element is peeked
      // Then no element is returned
      expect(queue.peek()).toBeUndefined()

      // Pushing elements
      queue.push('First', 20)
      queue.push('Second', 10)
      queue.push('Third', 30)

      // And an element is peeked
      // Then the first element is retrieved but not removed
      expect(queue.peek()).toEqual<XPriorityQueueNode<QueueRecord>>({
        key: 'Third',
        priority: 30,
        data: {},
      })
      expect(queue.keys).toEqual<(keyof QueueRecord)[]>(['Third', 'First', 'Second'])
    })
  })

  describe('clear', () => {
    it('does nothing if the queue is empty', () => {
      // Given an empty priority queue
      const queue = new BaseXPriorityQueue()
      expect(queue.isEmpty()).toBe(true)

      queue.clear()

      // Then the queue is empty
      expect(queue.size()).toBe(0)
      expect(queue.isEmpty()).toBe(true)
    })

    it('clears the queue', () => {
      // Given a priority queue with elements
      const queue = new BaseXPriorityQueue<QueueRecord>()
      queue.push('First', 10)
      queue.push('Second', 20)
      queue.push('Third', 30)

      // And the queue is cleared
      queue.clear()

      // Then the queue is empty
      expect(queue.size()).toBe(0)
      expect(queue.isEmpty()).toBe(true)
    })
  })

  describe('isEmpty', () => {
    it('checks if the queue is empty when it is empty', () => {
      // Given an empty queue
      const queue = new BaseXPriorityQueue()

      // And the size of the queue is checked
      // Then the assertion is true
      expect(queue.isEmpty()).toBe(true)
    })

    it('checks if the queue is empty when it is not empty', () => {
      // Given a queue with elements
      const queue = new BaseXPriorityQueue<QueueRecord>()
      queue.push('First', 10)
      queue.push('Second', 20)
      queue.push('Third', 30)

      // And the size of the queue is checked
      // Then the assertion is false
      expect(queue.isEmpty()).toBe(false)
    })
  })

  describe('size', () => {
    it('returns the size of the queue', () => {
      // Given an empty queue
      const queue = new BaseXPriorityQueue<QueueRecord>()

      // And the size of the queue is checked
      // Then the size is 0
      expect(queue.size()).toBe(0)

      // And elements are added to the queue
      queue.push('First', 10)
      queue.push('Second', 20)
      queue.push('Third', 30)

      // Then the size is equal to the number of added elements
      expect(queue.size()).toBe(3)
    })
  })

  describe('at', () => {
    it('returns the element of the queue at the given index', () => {
      // Given a queue
      const queue = new BaseXPriorityQueue<QueueRecord>()

      // And an index
      const index = 2

      // Then the element at that index is retrieved
      expect(queue.at(index)).toBeUndefined()

      // And elements are pushed to the queue
      queue.push('First', 30)
      queue.push('Second', 20)
      queue.push('Third', 10)

      // Then the element at that index is retrieved
      expect(queue.at(index)).toEqual<XPriorityQueueNode<QueueRecord>>({
        key: 'Third',
        priority: 10,
        data: {},
      })
    })
  })

  describe('toString', () => {
    it('returns an empty string if the queue is empty', () => {
      // Given an empty queue
      const queue = new BaseXPriorityQueue()
      expect(queue.toString()).toBe('')
    })

    it("returns queue's data stringified", () => {
      interface QueueNodeData {
        replaceable: boolean
        extra?: string
      }

      // Given a queue
      const queue = new BaseXPriorityQueue<QueueRecord, QueueNodeData>()
      queue.push('First', 30)
      queue.push('Second', 20, { replaceable: true })
      queue.push('Third', 10, { replaceable: true, extra: 'random' })

      // Then it is possible to output the queue's data as a string
      expect(queue.toString()).toEqual(`[30] First -> {}
[20] Second -> {"replaceable":true}
[10] Third -> {"replaceable":true,"extra":"random"}
`)
    })
  })
})
