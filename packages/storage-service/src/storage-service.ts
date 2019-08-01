export class StorageService {
  constructor(private storage: Storage = localStorage, private prefix: string = 'empathy') {}

  setItem(key: string, item: any, ttlInMs?: number): void {
    const prefixedKey = this.prefixKey(key);
    const expirableItem = this.createExpirableItem(item, ttlInMs);
    const serializedItem = JSON.stringify(expirableItem);
    this.storage.setItem(prefixedKey, serializedItem);
  }

  getItem<T = any>(key: string): T | null {
    this.removeExpiredItems();
    const prefixedKey = this.prefixKey(key);
    const serializedItem = this.storage.getItem(prefixedKey);
    if (serializedItem) {
      const item = JSON.parse(serializedItem);
      return this.getItemValue(item);
    } else {
      return null;
    }
  }

  removeItem<T = any>(key: string): T {
    const item = this.getItem(key);
    const prefixedKey = this.prefixKey(key);
    this.storage.removeItem(prefixedKey);
    return item;
  }

  clear(): number {
    return this.getOwnKeys()
      .reduce((removedCount, key) => {
        this.storage.removeItem(key);
        return ++removedCount;
      }, 0);
  }

  protected prefixKey(key: string): string {
    return `${ this.prefix }-${ key }`;
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
    return Object.keys(this.storage)
      .filter(key => key.startsWith(`${this.prefix}-`));
  }

  protected removeExpiredItems(): void {
    this.getOwnKeys()
      .forEach(key => {
        const serializedItem = this.storage.getItem(key);
        if (serializedItem) {
          const item = JSON.parse(serializedItem);
          if (item.ttl && item.ttl <= this.currentTimestamp()) {
            this.storage.removeItem(key);
          }
        }
      });
  }
}
