import { StorageService } from '@empathy/storage-service';

export const localStorageService = new StorageService(localStorage, 'x');
