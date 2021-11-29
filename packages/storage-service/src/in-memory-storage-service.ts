import { StorageService } from './storage-service';

/**
 * In memory implementation of the storage service.
 *
 * @public
 */
export class InMemoryStorageService implements StorageService {
  protected storage: Record<string, any> = {};

  /**
   * Adds a new item in the storage.
   *
   * @param key - The key of the item.
   * @param item - The item to save.
   *
   * @public
   */
  setItem(key: string, item: any): void {
    this.storage[key] = item;
  }

  /**
   * Retrieves an item by its key.
   *
   * @param key - The key of the item.
   * @returns The founded item or null.
   *
   * @public
   */
  getItem<Item = any>(key: string): Item | null {
    return this.storage[key] ?? null;
  }

  /**
   * Removes an item by its key.
   *
   * @param key - The key of the item.
   * @returns The removed item or null.
   *
   * @public
   */
  removeItem<Item = any>(key: string): Item | null {
    const item = this.storage[key];
    delete this.storage[key];
    return item;
  }

  /**
   * Clears the storage..
   *
   * @returns The number of removed items.
   *
   * @public
   */
  clear(): number {
    const numberOfRemovedItems = Object.keys(this.storage).length;
    this.storage = {};
    return numberOfRemovedItems;
  }
}
