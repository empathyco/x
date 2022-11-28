import { AnyFunction } from '@empathyco/x-utils';

export type XPriorityQueueNodeMetadata = { replaceable?: boolean; [key: string]: unknown };

/**
 * An XPriorityQueueNode object is a representation of a structure containing a parametrized key, a
 * priority number and metadata record. By default, the key is a string.
 *
 * @public
 */
export class XPriorityQueueNode<Key = string> {
  /**
   * The key to store the element in the queue.
   *
   * @public
   */
  public readonly key: Key;

  /**
   * The number used to sort the elements in the queue.
   *
   * @public
   */
  public readonly priority: number;

  /**
   * The extra data to store in the queue associated with a key and priority pair. Optionally, a
   * `boolean` `replaceable` key can be used in order to make the node replaceable in the queue.
   * Being replaceable means that if a new element is pushed into the queue with the same key, the
   * existing one will be removed.
   *
   * @public
   */
  public readonly metadata: XPriorityQueueNodeMetadata;

  /**
   * Creates a new PriorityQueueNode with the given key, priority and metadata.
   *
   * @param key - The key.
   * @param priority - The priority.
   * @param metadata - The metadata.
   *
   * @public
   */
  public constructor(key: Key, priority: number, metadata: XPriorityQueueNodeMetadata = {}) {
    this.key = key;
    this.priority = priority;
    this.metadata = metadata;
  }

  /**
   * Returns a string representation of this object. The string representation consists of: its
   * priority, enclosed in square brackets ("[]"), followed by its key, an arrow (->) and the
   * metadata converted to string as by JSON.stringify(Object).
   *
   * @example
   * [10] 1 -> { replaceable: false, randomKey: randomValue }
   *
   * @returns A string representation of this object.
   *
   * @public
   */
  toString(): string {
    return `[${this.priority}] ${String(this.key)} -> ${JSON.stringify(this.metadata)}`;
  }
}

/**.
 * A priority queue implementation storing replaceable elements with a metadata associated to a
 * defined key and priority. By default, the keys are strings.
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
export class XPriorityQueue<Key = string> {
  /**
   * The list of stored {@link XPriorityQueueNode | nodes}.
   *
   * @internal
   */
  protected nodes: XPriorityQueueNode<Key>[] = [];

  /**
   * The comparator function to use for sorting.
   *
   * @internal
   */
  protected comparatorFn: AnyFunction<boolean>;

  /**
   * Creates a new {@link XPriorityQueue}.
   *
   * @param comparatorFn - Comparator - the comparator that will be used to order this queue.
   * By default, the elements will be sorted in descending order (an element with priority 1 will
   * be higher than another with priority 5).
   */
  public constructor(comparatorFn: AnyFunction<boolean> = (a: number, b: number) => a > b) {
    this.comparatorFn = comparatorFn;
  }

  /**
   * The `keys` property of a {@link XPriorityQueue} represents the keys of that queue. The value is
   * an array of the parametrized `Key` type.
   *
   * @returns The list of keys.
   *
   * @public
   */
  public get keys(): Key[] {
    return this.nodes.map(({ key }) => key);
  }

  /**
   * Inserts the specified key and priority pair, with an optional metadata, into the queue.
   *
   * @param key - The key to insert.
   * @param priority - The priority to order the element in the queue.
   * @param metadata - The extra data associated to a key and priority pair.
   *
   * @public
   */
  push(key: Key, priority: number, metadata?: XPriorityQueueNodeMetadata): void {
    const node = new XPriorityQueueNode<Key>(key, priority, metadata);

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
  private pushAndSort(newNode: XPriorityQueueNode<Key>): void {
    const replaceableIndex = this.nodes.findIndex(node => node.key === newNode.key);

    if (replaceableIndex > -1 && this.nodes[replaceableIndex].metadata.replaceable) {
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
   * Retrieves and removes the head {@link XPriorityQueueNode | node} of the queue.
   *
   * @returns The head {@link XPriorityQueueNode | node} of the queue or undefined if it is empty.
   */
  pop(): XPriorityQueueNode<Key> | undefined {
    return this.nodes.shift();
  }

  /**
   * Retrieves, but does not remove, the head {@link XPriorityQueueNode | node} of the queue.
   *
   * @returns The head {@link XPriorityQueueNode | node} of the queue.
   *
   * @public
   */
  peek(): XPriorityQueueNode<Key> | undefined {
    return this.nodes[0];
  }

  /**
   * Retrieves the {@link XPriorityQueueNode | node} at a given position.
   *
   * @param index - The position to look at.
   *
   * @returns The {@link XPriorityQueueNode | node} at the passed position in the queue.
   *
   * @public
   */
  at(index: number): XPriorityQueueNode<Key> | undefined {
    return this.nodes[index];
  }

  /**
   * Removes all of the {@link XPriorityQueueNode | nodes} from the queue.
   *
   * @public
   */
  clear(): void {
    this.nodes.length = 0;
  }

  /**
   * Checks if the queue is empty.
   *
   * @returns True if the queue is empty, false otherwise.
   *
   * @public
   */
  isEmpty(): boolean {
    return this.nodes.length === 0;
  }

  /**
   * Retrieves the number of {@link XPriorityQueueNode | nodes} stored in the queue.
   *
   * @returns The number of {@link XPriorityQueueNode | nodes} stored in the queue.
   *
   * @public
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
   * [10] 1 -> { replaceable: false, a: 'b' }
   * [20] 2 -> { replaceable: false }
   * [30] 3 -> { replaceable: false, c: 1 }
   *
   * @returns A string representation of the queue.
   *
   * @public
   */
  toString(): string {
    return this.nodes.reduce<string>((output, node) => output.concat(node.toString(), '\n'), '');
  }
}
