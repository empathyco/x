import { Logger, logger } from '@empathyco/x-logger';
import { StorageService } from './storage-service';

/**
 * In browser implementation of the storage service.
 *
 * @public
 */
export class BrowserStorageService implements StorageService {
  protected logger: Logger;

  public constructor(private storage: Storage = localStorage, private prefix: string = 'empathy') {
    this.logger = logger.child(`[StorageService][${prefix}]`);
  }

  /**
   * Adds a new item in the browser storage.
   *
   * @param key - The key of the item.
   * @param item - The item to save.
   * @param ttlInMs - The TTL in ms of the item in the browser storage.
   *
   * @public
   */
  setItem(key: string, item: any, ttlInMs?: number): void {
    if (item === undefined) {
      this.logger.warn(`Tried to store an undefined object with key ${key}`);
    } else {
      const prefixedKey = this.prefixKey(key);
      const expirableItem = this.createExpirableItem(item, ttlInMs);
      const serializedItem = JSON.stringify(expirableItem);
      this.storage.setItem(prefixedKey, serializedItem);
    }
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
    this.removeExpiredItems();
    const prefixedKey = this.prefixKey(key);
    const serializedItem = this.storage.getItem(prefixedKey);
    if (serializedItem) {
      const item = JSON.parse(serializedItem);
      return this.getItemValue(item);
    }
    return null;
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
    const item = this.getItem(key);
    const prefixedKey = this.prefixKey(key);
    this.storage.removeItem(prefixedKey);
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
    return this.getOwnKeys().reduce((removedCount, key) => {
      this.storage.removeItem(key);
      return ++removedCount;
    }, 0);
  }

  protected prefixKey(key: string): string {
    return `${this.prefix}-${key}`;
  }

  protected createExpirableItem(item: any, ttlInMs?: number): any {
    return {
      ...(!!ttlInMs && { ttl: ttlInMs + this.currentTimestamp() }),
      value: item
    };
  }

  protected currentTimestamp(): number {
    return Date.now();
  }

  protected getItemValue(item: any): any {
    return item.value;
  }

  protected getOwnKeys(): string[] {
    return Object.keys(this.storage).filter(key => key.startsWith(`${this.prefix}-`));
  }

  protected removeExpiredItems(): void {
    this.getOwnKeys().forEach(key => {
      const serializedItem = this.storage.getItem(key);
      if (serializedItem) {
        try {
          const item = JSON.parse(serializedItem);
          if (item.ttl && item.ttl <= this.currentTimestamp()) {
            this.storage.removeItem(key);
          }
        } catch {
          this.logger.warn(
            // eslint-disable-next-line max-len
            `Item for key ${key} has been removed from storage because it had an invalid JSON value: "${serializedItem}"`
          );
          this.storage.removeItem(key);
        }
      }
    });
  }
}
