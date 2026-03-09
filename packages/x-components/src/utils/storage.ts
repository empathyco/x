import type { StorageService } from '@empathyco/x-utils'
import { BrowserStorageService } from '@empathyco/x-utils'
import { noOp } from './function'

/**
 * Service instance of {@link @empathyco/x-utils#StorageService | storage service} if
 * localStorage is available.
 * If not, required {@link @empathyco/x-utils#StorageService | storage service} functions
 * are initialized with empty implementations.
 * @internal
 */
export const localStorageService: StorageService =
  typeof localStorage !== 'undefined'
    ? new BrowserStorageService(localStorage, 'x')
    : {
        clear: noOp,
        getItem: noOp,
        setItem: noOp,
        removeItem: noOp,
      }
