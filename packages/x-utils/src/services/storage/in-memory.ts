import type { StorageService } from './types'

/**
 * In memory implementation of the storage service.
 */
export class InMemoryStorageService implements StorageService {
  protected storage: Record<string, any> = {}

  /**
   * Adds a new item in the storage.
   *
   * @param key - The key of the item.
   * @param item - The item to save.
   */
  setItem(key: string, item: any) {
    this.storage[key] = item
  }

  /**
   * Retrieves an item by its key.
   *
   * @param key - The key of the item.
   * @returns The founded item or null.
   */
  getItem<Item = any>(key: string): Item | null {
    return this.storage[key] ?? null
  }

  /**
   * Removes an item by its key.
   *
   * @param key - The key of the item.
   * @returns The removed item or null.
   */
  removeItem<Item = any>(key: string): Item | null {
    const item = this.storage[key]
    delete this.storage[key]
    return item
  }

  /**
   * Clears the storage.
   *
   * @returns The number of removed items.
   */
  clear() {
    const numberOfRemovedItems = Object.keys(this.storage).length
    this.storage = {}
    return numberOfRemovedItems
  }
}
