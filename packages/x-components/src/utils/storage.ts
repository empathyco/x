import { BrowserStorageService } from '@empathyco/x-storage-service';
import { noOp } from './function';

/**
 * Service instance of {@link @empathyco/x-storage-service#StorageService | storage service} if
 * localStorage is available.
 * If not, required {@link @empathyco/x-storage-service#StorageService | storage service} functions
 * are initialized with empty implementations.
 *
 * @internal
 */
export const localStorageService =
  typeof localStorage !== 'undefined'
    ? new BrowserStorageService(localStorage, 'x')
    : {
        clear: noOp,
        getItem: noOp,
        setItem: noOp,
        removeItem: noOp
      };
