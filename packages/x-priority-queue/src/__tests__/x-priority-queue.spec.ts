import { XPriorityQueue } from '../x-priority-queue';

describe('x-priority-queue scenarios', () => {
  describe('constructor', () => {
    it('uses the comparator function passed to the constructor to sort the queue', () => {
      // Given a queue passing a comparator function to its constructor
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const queue = new XPriorityQueue((a, b) => a < b);

      // And elements are inserted
      queue.push('1', 10);
      queue.push('2', 20);
      queue.push('3', 30);

      // Then the order of the elements is sorted by the passed comparator function
      expect(queue.keys).toEqual(['3', '2', '1']);
    });
  });

  describe('push', () => {
    it('inserts an element when the queue is empty', () => {
      // Given an empty priority queue
      const queue = new XPriorityQueue();

      // And an element is pushed
      const key = '1';
      const priority = 10;
      const metadata = { location: 'patata' };
      queue.push(key, 10, metadata);

      // Then the element is inserted at the first position
      const insertedElement = queue.at(0);
      expect(insertedElement!.key).toBe(key);
      expect(insertedElement!.priority).toBe(priority);
      expect(insertedElement!.metadata).toEqual(metadata);
    });

    it('inserts an element when the queue is not empty', () => {
      // Given a priority queue with elements
      const queue = new XPriorityQueue();
      queue.push('1', 10);
      queue.push('2', 20);
      queue.push('3', 30);

      // And elements are pushed
      queue.push('4', 40);
      queue.push('5', 15);
      queue.push('6', 0);

      // Then each element is inserted at the correct position
      expect(queue.keys).toEqual(['6', '1', '5', '2', '3', '4']);
    });

    // eslint-disable-next-line max-len
    it('inserts an element with the same key as an already existing non-replaceable element', () => {
      // Given a priority queue with non-replaceable elements
      const queue = new XPriorityQueue();
      queue.push('1', 10, { previous: true });
      queue.push('2', 20);
      queue.push('3', 30);

      // And an element with an existing key is inserted
      queue.push('1', 10, { newer: true });

      // Then the element is inserted without removing the other one
      const existingElement = queue.at(0);
      const newElement = queue.at(1);

      expect(existingElement!.key).toBe('1');
      expect(existingElement!.priority).toBe(10);
      expect(existingElement!.metadata).toEqual({ previous: true });
      expect(newElement!.key).toBe('1');
      expect(newElement!.priority).toBe(10);
      expect(newElement!.metadata).toEqual({ newer: true });
    });

    // eslint-disable-next-line max-len
    it('inserts an element with the same key as an already existing and replaceable element', () => {
      // Given a priority queue with replaceable elements
      const queue = new XPriorityQueue();
      queue.push('1', 10, { replaceable: true });
      queue.push('2', 20);
      queue.push('3', 30);

      // And an element with an existing key is inserted
      queue.push('1', 40);

      // Then the existing element is removed and the new one is inserted at the correct position
      expect(queue.keys).toEqual(['2', '3', '1']);
    });
  });

  describe('pop', () => {
    it('does not remove anything when the queue is empty', () => {
      // Given an empty priority queue
      const queue = new XPriorityQueue();

      // And an element is popped
      // Then nothing is removed
      expect(queue.pop()).toBeUndefined();
    });

    it('removes and retrieves the first element of the queue when it is not empty', () => {
      // Given a priority queue with elements
      const queue = new XPriorityQueue();
      queue.push('3', 30);
      queue.push('1', 10);
      queue.push('2', 20);

      // And an element is popped
      // Then the first element is removed and retrieved
      expect(queue.pop()!.key).toBe('1');
      expect(queue.keys).toEqual(['2', '3']);
    });
  });

  describe('peek', () => {
    it('returns the first element of the queue without removing it', () => {
      // Given an empty queue
      const queue = new XPriorityQueue();

      // And an element is peeked
      // Then no element is returned
      expect(queue.peek()).toBeUndefined();

      // Pushing elements
      queue.push('1', 10);
      queue.push('2', 20);
      queue.push('3', 5);

      // And an element is peeked
      // Then the first element is retrieved but not removed
      expect(queue.peek()!.key).toBe('3');
      expect(queue.keys).toEqual(['3', '1', '2']);
    });
  });

  describe('clear', () => {
    it('does nothing if the queue is empty', () => {
      // Given an empty priority queue
      const queue = new XPriorityQueue();
      queue.clear();
      // Then the queue is empty
      expect(queue.size()).toBe(0);
      expect(queue.isEmpty()).toBe(true);
    });

    it('clears the queue', () => {
      // Given a priority queue with elements
      const queue = new XPriorityQueue();
      queue.push('1', 10);
      queue.push('2', 20);
      queue.push('3', 30);

      // And the queue is cleared
      queue.clear();

      // Then the queue is empty
      expect(queue.size()).toBe(0);
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('checks if the queue is empty when it is empty', () => {
      // Given an empty queue
      const queue = new XPriorityQueue();

      // And the size of the queue is checked
      // Then the assertion is true
      expect(queue.isEmpty()).toBe(true);
    });

    it('checks if the queue is empty when it is not empty', () => {
      // Given a queue with elements
      const queue = new XPriorityQueue();
      queue.push('1', 10);
      queue.push('2', 20);
      queue.push('3', 30);

      // And the size of the queue is checked
      // Then the assertion is false
      expect(queue.isEmpty()).toBe(false);
    });
  });

  describe('size', () => {
    it('returns the size of the queue', () => {
      // Given an empty queue
      const queue = new XPriorityQueue();

      // And the size of the queue is checked
      // Then the size is 0
      expect(queue.size()).toBe(0);

      // And elements are added to the queue
      queue.push('1', 10);
      queue.push('2', 20);
      queue.push('3', 30);

      // Then the size is equal to the number of added elements
      expect(queue.size()).toBe(3);
    });
  });

  describe('at', () => {
    it('returns the element of the queue at the given index', () => {
      // Given a queue
      const queue = new XPriorityQueue();

      // And an index
      const index = 2;

      // Then the element at that index is retrieved
      expect(queue.at(index)).toBeUndefined();

      // And elements are pushed to the queue
      queue.push('1', 10);
      queue.push('2', 20);
      queue.push('3', 30);

      // Then the element at that index is retrieved
      expect(queue.at(index)!.key).toBe('3');
    });
  });

  describe('toString', () => {
    it('returns an empty string if the queue is empty', () => {
      // Given an empty queue
      const queue = new XPriorityQueue();
      expect(queue.toString()).toBe('');
    });

    it("returns queue's data stringified", () => {
      // Given a queue
      const queue = new XPriorityQueue();
      queue.push('1', 10);
      queue.push('2', 10, { replaceable: true });
      queue.push('3', 30, { replaceable: true, extra: 'potato' });

      // Then it is possible to output the queue's data as a string
      expect(queue.toString()).toEqual(`[10] 1 -> {}
[10] 2 -> {"replaceable":true}
[30] 3 -> {"replaceable":true,"extra":"potato"}
`);
    });
  });
});
