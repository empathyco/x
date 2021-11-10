import { StorageService } from '@empathyco/x-storage-service';

/**
 * Storage Service mock version.
 *
 * @internal
 */
export class MockedStorageService extends StorageService {
  getSessionIdSpy = jest.fn();
  setSessionIdSpy = jest.fn();
  removeSessionIdSpy = jest.fn();

  constructor(_storage: Storage, protected _prefix: string) {
    super();
  }

  getPrefix(): string {
    return this._prefix;
  }

  injectGetResponse(key: string): void {
    this.getSessionIdSpy.mockReturnValue(key);
  }

  getItem<T = any>(key: string): any {
    return this.getSessionIdSpy(key);
  }

  setItem(key: string, item: any, ttlInMs?: number) {
    this.setSessionIdSpy(key, item, ttlInMs);
  }

  removeItem<T = any>(key: string): any {
    this.removeSessionIdSpy(key);
    return key;
  }

  clear(): number {
    return 0;
  }
}
