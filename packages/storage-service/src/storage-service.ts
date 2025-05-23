/**
 * Storage service interface to interact with the storage.
 *
 * @public
 */
export interface StorageService {
  /**
   * Inserts a new item in the storage.
   *
   * @param key - The key of the item.
   * @param item - The item itself.
   * @param ttlInMs - The TTL (Time To Live) of the item in the storage.
   *
   * @public
   */
  setItem: (key: string, item: any, ttlInMs?: number) => void

  /**
   * Retrieves an item from the storage by its key.
   *
   * @param key - The key of the item to search.
   * @returns The removed item.
   *
   * @public
   */
  getItem: <Item = any>(key: string) => Item | null

  /**
   * Removes an item in the storage find by its key.
   *
   * @param key - The key of the item to search.
   * @returns The removed item.
   *
   * @public
   */
  removeItem: <Item = any>(key: string) => Item | null

  /**
   * Removes all the entries in the storage.
   *
   * @public
   */
  clear: () => number
}
