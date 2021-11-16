import { StorageService } from '@empathyco/x-storage-service';

/**
 * Mocked version of the real Storage Service for testing.
 *
 * @internal
 */
export class MockedStorageService extends StorageService {
  public getSessionIdSpy = jest.fn();
  public setSessionIdSpy = jest.fn();
  public removeSessionIdSpy = jest.fn();

  public constructor(protected _prefix: string) {
    super(undefined, _prefix);
  }

  getPrefix(): string {
    return this._prefix;
  }

  mockSessionIdValue(key: string): void {
    this.getSessionIdSpy.mockReturnValue(key);
  }

  getItem<T = any>(key: string): any {
    return this.getSessionIdSpy(key);
  }

  setItem(key: string, item: any, ttlMs?: number): void {
    this.setSessionIdSpy(key, item, ttlMs);
  }

  removeItem<T = any>(key: string): any {
    this.removeSessionIdSpy(key);
    return key;
  }
}
