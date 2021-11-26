import { Dictionary } from '../../search-adapter/types/types/utils.types';
import { StorageService } from './storage-service';

export class InMemoryStorageService<Item = any> implements StorageService<Item> {
  protected storage: Dictionary<Item> = {};

  setItem(key: string, item: any): void {
    this.storage[key] = item;
  }

  getItem(key: string): Item | null {
    return this.storage[key] ?? null;
  }

  removeItem(key: string): Item | null {
    const item = this.storage[key];
    delete this.storage[key];
    return item;
  }

  clear(): number {
    const numberOfRemovedItems = Object.keys(this.storage).length;
    this.storage = {};
    return numberOfRemovedItems;
  }
}
