import { StorageService } from '@empathy/storage-service';
import { noOp } from './function';

/**
 * Service instance of {@link @empathy/storage-service#StorageService | storage service} if
 * localStorage is available.
 * If not, required {@link @empathy/storage-service#StorageService | storage service} functions
 * are initialized with empty implementations.
 *
 * @internal
 */
export const localStorageService =
  typeof localStorage !== 'undefined'
    ? new StorageService(localStorage, 'x')
    : {
        clear: noOp,
        getItem: noOp,
        setItem: noOp,
        removeItem: noOp
      };
