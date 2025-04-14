import type { Dictionary } from '@empathyco/x-utils'

/**
 * An object containing a key, a priority number and a data.
 *
 * @public
 */
export interface XPriorityQueueNode<
  SomeRecord extends Dictionary,
  SomeData extends Dictionary = Dictionary,
> {
  /**
   * The key to store the element in the queue.
   *
   * @public
   */
  key: keyof SomeRecord
  /**
   * The number used to sort the elements in the queue.
   *
   * @public
   */
  priority: number
  /**
   * The extra data to store in the queue associated with a key and priority pair.
   *
   * @public
   */
  data: SomeData
}

/**
 * Data structure to store a list of entries ordered by their priority.
 *
 * @public
 */
export interface XPriorityQueue<SomeRecord extends Dictionary, SomeData extends Dictionary> {
  /**
   * Inserts an element into the queue in the correct position based on its priority.
   *
   * @param key - The key of the element to insert.
   * @param priority - The priority of the element to insert. This will determine its position
   * in the queue.
   * @param data - Extra data related to the inserted key.
   */
  push: (key: keyof SomeRecord, priority: number, data?: SomeData) => void

  /**
   * Retrieves and removes the head {@link XPriorityQueueNode | node} of the queue.
   *
   * @returns The head {@link XPriorityQueueNode | node} of the {@link XPriorityQueue | queue} or
   * undefined if the queue is empty.
   */
  pop: () => XPriorityQueueNode<SomeRecord, SomeData> | undefined

  /**
   * Retrieves the number of elements stored in the queue.
   *
   * @returns The number of elements in the queue.
   */
  size: () => number
}

/**
 * Alias type representing a comparator function between two numbers.
 *
 * @public
 */
export type NumberComparatorFn = (a: number, b: number) => boolean
