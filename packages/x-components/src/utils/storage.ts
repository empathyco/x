import { StorageService } from '@empathy/storage-service';
import { noOp } from './function';

export const localStorageService =
  typeof localStorage !== 'undefined'
    ? new StorageService(localStorage, 'x')
    : {
        clear: noOp,
        getItem: noOp,
        setItem: noOp,
        removeItem: noOp
      };
