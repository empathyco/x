import { Dictionary } from '@empathyco/x-utils';
import { PriorityComparatorFn, XPriorityQueue, XPriorityQueueNode } from './x-priority-queue.types';

/**
 * Default {@link XPriorityQueueNode} implementation.
 *
 * @public
 */
export class BaseXPriorityQueueNode<
  SomeKey extends string = string,
  SomeData extends Dictionary = Dictionary
> implements XPriorityQueueNode<SomeKey, SomeData>
{
  public readonly key: SomeKey;
  public readonly priority: number;
  public readonly data: SomeData;

  public constructor(key: SomeKey, priority: number, data = {} as SomeData) {
    this.key = key;
    this.priority = priority;
    this.data = data;
  }

  /**
   * Returns a string representation of this object. The string representation consists of: its
   * priority, enclosed in square brackets (`[]`), followed by its key, an arrow `(->)` and the
   * data converted to string as by JSON.stringify(Object).
   *
   * @example
   * ```
   * [10] 1 -> { replaceable: false, randomKey: randomValue }
   * ```
   *
   * @returns A string representation of this object.
   *
   * @public
   */
  toString(): string {
    return `[${this.priority}] ${this.key} -> ${JSON.stringify(this.data)}`;
  }
}

/**.
 * Default {@link XPriorityQueue} implementation.
 *
 * Method         big-O
 * ---------------------------
 * - push         O(n)
 * - pop          O(1)
 * - peek         O(1)
 * - at           O(1)
 *
 * @public
 */
export class BaseXPriorityQueue<
  SomeKey extends string = string,
  SomeData extends Dictionary = Dictionary
> implements XPriorityQueue<SomeKey, SomeData>
{
  /**
   * The list of stored {@link XPriorityQueueNode | nodes}.
   *
   * @internal
   */
  protected nodes: XPriorityQueueNode<SomeKey, SomeData>[] = [];

  /**
   * The comparator function to use for sorting.
   *
   * @internal
   */
  protected comparatorFn: PriorityComparatorFn;

  /**
   * Creates a new {@link XPriorityQueue}.
   *
   * @param comparatorFn - Comparator - the comparator that will be used to order this queue.
   * By default, the elements will be sorted in descending order (an element with priority 1 will
   * be higher than another with priority 5).
   */
  public constructor(comparatorFn: PriorityComparatorFn = (a: number, b: number) => a > b) {
    this.comparatorFn = comparatorFn;
  }

  /**
   * The `keys` property of a {@link XPriorityQueue} represents the keys of that queue. The value is
   * an array of the parametrized `Key` type.
   *
   * @returns The list of keys.
   */
  public get keys(): SomeKey[] {
    return this.nodes.map(({ key }) => key);
  }

  /**.
   * See {@link XPriorityQueue.push}.
   *
   * @remarks
   * If the optional data has a 'replaceable: true' and a similar key is already in the queue,
   * the previous key will be removed and the new one will be inserted to the queue at the
   * correct position based on its new priority.
   *
   * @param key - The key to insert.
   * @param priority - The priority to order the element in the queue.
   * @param data - The extra data associated to a key and priority pair.
   */
  push(key: SomeKey, priority: number, data?: SomeData): void {
    const node = new BaseXPriorityQueueNode<SomeKey, SomeData>(key, priority, data);

    if (this.isEmpty()) {
      this.nodes.push(node);
    } else {
      this.pushAndSort(node);
    }
  }

  /**
   * Inserts the node into the queue in the correct position based on the
   * {@link comparatorFn | comparator function}.
   *
   * @param newNode - The {@link XPriorityQueueNode | node} to be inserted.
   *
   * @internal
   */
  private pushAndSort(newNode: XPriorityQueueNode<SomeKey, SomeData>): void {
    const replaceableIndex = this.nodes.findIndex(node => node.key === newNode.key);

    if (replaceableIndex > -1 && this.nodes[replaceableIndex].data.replaceable) {
      this.nodes.splice(replaceableIndex, 1);
    }

    const insertAtIndex = this.nodes.findIndex(node =>
      this.comparatorFn(node.priority, newNode.priority)
    );

    if (insertAtIndex === -1) {
      this.nodes.push(newNode);
    } else {
      this.nodes.splice(insertAtIndex, 0, newNode);
    }
  }

  /**
   * See {@link XPriorityQueue.pop}.
   *
   * @returns The head {@link XPriorityQueueNode | node} of the queue or undefined if it is empty.
   */
  pop(): XPriorityQueueNode<SomeKey, SomeData> | undefined {
    return this.nodes.shift();
  }

  /**
   * Retrieves, but does not remove, the head {@link XPriorityQueueNode | node} of the queue.
   *
   * @returns The head {@link XPriorityQueueNode | node} of the queue.
   */
  peek(): XPriorityQueueNode<SomeKey, SomeData> | undefined {
    return this.nodes[0];
  }

  /**
   * Retrieves the {@link XPriorityQueueNode | node} at a given position.
   *
   * @param index - The position to look at.
   *
   * @returns The {@link XPriorityQueueNode | node} at the passed position in the queue.
   */
  at(index: number): XPriorityQueueNode<SomeKey, SomeData> | undefined {
    return this.nodes[index];
  }

  /**
   * Removes all the {@link XPriorityQueueNode | nodes} from the queue.
   */
  clear(): void {
    this.nodes.length = 0;
  }

  /**
   * Checks if the queue is empty.
   *
   * @returns True if the queue is empty, false otherwise.
   */
  isEmpty(): boolean {
    return this.nodes.length === 0;
  }

  /**
   * Retrieves the number of {@link XPriorityQueueNode | nodes} stored in the queue.
   *
   * @returns The number of {@link XPriorityQueueNode | nodes} stored in the queue.
   */
  size(): number {
    return this.nodes.length;
  }

  /**
   * Returns a string representation of this collection. The string representation consists of a
   * list of the queue {@link XPriorityQueueNode | nodes} split in multiple lines, one for each
   * one. Nodes are converted to strings as by {@link XPriorityQueueNode.toString | toString()}.
   *
   * @example
   * ```
   * [10] 1 -> { replaceable: false, a: 'b' }
   * [20] 2 -> { replaceable: false }
   * [30] 3 -> { replaceable: false, c: 1 }
   * ```
   *
   * @returns A string representation of the queue.
   */
  toString(): string {
    return this.nodes.reduce((output, node) => output.concat(node.toString(), '\n'), '');
  }
}
