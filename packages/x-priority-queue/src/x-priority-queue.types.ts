import { Dictionary } from '@empathyco/x-utils';

/**
 * An object containing a key, a priority number and a data. By default, the key is of type
 * string and the data is of type {@link @empathyco/x-utils#Dictionary | dictionary}.
 *
 * @public
 */
export interface XPriorityQueueNode<SomeKey extends string, SomeData extends Dictionary> {
  /**
   * The key to store the element in the queue.
   *
   * @public
   */
  key: SomeKey;
  /**
   * The number used to sort the elements in the queue.
   *
   * @public
   */
  priority: number;
  /**
   * The extra data to store in the queue associated with a key and priority pair.
   *
   * @public
   */
  data: SomeData;
}

/**
 * Data structure to store a list of entries ordered by their priority.
 *
 * @public
 */
export interface XPriorityQueue<SomeKey extends string, SomeData extends Dictionary> {
  /**
   * Inserts an element into the queue in the correct position based on its priority.
   *
   * @param key - The key of the element to insert.
   * @param priority - The priority of the element to insert. This will determine its position
   * in the queue.
   * @param data - Extra data related to the inserted key.
   *
   * @public
   */
  push(key: SomeKey, priority: number, data?: SomeData): void;

  /**
   * Retrieves and removes the head {@link XPriorityQueueNode | node} of the queue.
   *
   * @returns The head {@link XPriorityQueueNode | node} of the {@link XPriorityQueue | queue} or
   * undefined if the queue is empty.
   *
   * @public
   */
  pop(): XPriorityQueueNode<SomeKey, SomeData> | undefined;
}

/**
 * Alias type to express a priority comparator function.
 *
 * @public
 */
export type PriorityComparatorFn = (a: number, b: number) => boolean;
