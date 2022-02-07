import { InMemoryStorageService } from '../in-memory-storage-service';
import { StorageService } from '../storage-service';

let storage: StorageService;
const key = 'key';
const anotherKey = 'another-key';
const item = { a: 'item', b: true, c: 288 };

describe('testing InMemoryStorageService', () => {
  beforeEach(() => {
    storage = new InMemoryStorageService();
  });

  it('gets an item from storage', () => {
    storage.setItem(key, item);
    expect(storage.getItem(key)).toEqual(item);
  });

  it('removes an item from storage and returns it', () => {
    storage.setItem(key, item);
    expect(storage.removeItem(key)).toEqual(item);
  });

  it('clears all the items', () => {
    storage.setItem(key, item);
    storage.setItem(anotherKey, item);
    expect(storage.clear()).toEqual(2);
    expect(storage.getItem(key)).toBeNull();
    expect(storage.getItem(anotherKey)).toBeNull();
  });

  it('does not allow you to save undefined values', () => {
    storage.setItem(key, undefined);
    expect(storage.getItem(key)).toBeNull();
  });

  it('allows you to save null values', () => {
    storage.setItem(key, null);
    expect(storage.getItem(key)).toBeNull();
  });
});
