import { StorageService } from '@empathy/storage-service';

export const HISTORY_QUERIES_STORAGE_KEY = 'history-queries';
export const SESSION_TIME_STAMP_STORAGE_KEY = 'session-time-stamp';
export const localStorageService = new StorageService(localStorage, 'x');
