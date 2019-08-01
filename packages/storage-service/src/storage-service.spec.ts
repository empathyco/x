import { StorageService } from './storage-service';

let storage: StorageService;
const prefix = 'custom';
const key = 'key';
const anotherKey = 'another-key';
const item = { a: 'item', b: true, c: 288 };
const startingTimestamp = 1563868724320;

beforeEach(() => {
  localStorage.clear();
  storage = new StorageService(localStorage);
  Date.now = jest.fn(() => startingTimestamp);
});

it('saves an item in local storage', () => {
  storage.setItem(key, item);
  expect(localStorage).toHaveLength(1);
});

it('gets an item from local storage', () => {
  storage.setItem(key, item);
  expect(storage.getItem(key)).toEqual(item);
});

it('removes an item from local storage and returns it', () => {
  storage.setItem(key, item);
  expect(storage.removeItem(key)).toEqual(item);
  expect(localStorage).toHaveLength(0);
});

it('supports custom prefixes', () => {
  storage = new StorageService(localStorage, prefix);
  storage.setItem(key, item);
  expect(localStorage).toHaveLength(1);
  expect(localStorage.getItem(key)).toBeNull();
  expect(Object.keys(localStorage).filter(key => key.indexOf(prefix) === 0)).toHaveLength(1);
  expect(storage.getItem(key)).toEqual(item);
  expect(storage.removeItem(key)).toEqual(item);
  expect(localStorage).toHaveLength(0);
});

it('supports ttl', () => {
  storage.setItem(key, item, 50);
  expect(storage.getItem(key)).toEqual(item);
  Date.now = jest.fn(() => startingTimestamp + 100);
  expect(storage.getItem(key)).toBeNull();
});

it('removes expired items without explicitly getting them', () => {
  storage.setItem(key, item, 50);
  storage.setItem(anotherKey, item);
  expect(storage.getItem(key)).toEqual(item);
  expect(storage.getItem(anotherKey)).toEqual(item);
  Date.now = jest.fn(() => startingTimestamp + 100);
  expect(storage.getItem(anotherKey)).toEqual(item); // Unexpired item still exists
  expect(localStorage).toHaveLength(1); // Expired item is removed from storage without actively getting it
});

it('clears all the items', () => {
  storage.setItem(key, item);
  storage.setItem(anotherKey, item);
  expect(storage.clear()).toEqual(2);
  expect(localStorage).toHaveLength(0);
});
