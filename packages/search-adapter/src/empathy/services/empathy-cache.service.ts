import { StorageService } from '@empathy/storage-service';
import { inject, injectable } from 'inversify';
import { DEPENDENCIES } from '../container/container.const';
import { CacheService } from './cache-service.types';

@injectable()
export class EmpathyCacheService implements CacheService {

  constructor(
    @inject(DEPENDENCIES.storageService) protected readonly storageService: StorageService
  ) {}

  setItem(key: string, item: any, ttlInMinutes: number): void {
    this.storageService.setItem(this.transformKey(key), item, this.minutesToMilliseconds(ttlInMinutes));
  }

  getItem<T = any>(key: string): T | null {
    return this.storageService.getItem<T>(this.transformKey(key));
  }

  removeItem<T = any>(key: string): T | null {
    return this.storageService.removeItem<T>(this.transformKey(key));
  }

  clear(): number {
    return this.storageService.clear();
  }

  protected transformKey(key: string) {
    return `cache-${ this.hash(key) }`;
  }

  protected hash(key: string): string {
    // https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0#gistcomment-2775538
    let h = 0;
    for (let i = 0; i < key.length; i++) {
      // tslint:disable-next-line:no-bitwise
      h = Math.imul(31, h) + key.charCodeAt(i) | 0;
    }
    return h.toString();
  }

  protected minutesToMilliseconds(minutes: number) {
    return minutes * 60 * 1000;
  }
}
