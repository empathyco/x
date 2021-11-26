# Storage Service

Storage Service is a wrapper on top of the Web Storage API that provides additional features such as
key prefixing and TTL.

## Creating an instance

By default, Storage Service works with `localStorage` and using `empathy` as prefix. If that sounds
good, you can just do:

```typescript
const storage = new BrowserStorageService();
```

You can also customize the storage or prefix to be used in the constructor:

```typescript
StorageService(storage?, prefix?)
```

For instance, if you want to use `sessionStorage` and `test` as prefix instead:

```typescript
const storage = StorageService(sessionStorage, 'test');
```

## Usage

Storage Service provides four public functions: `setItem`, `getItem`, `removeItem` and `clear`.

### Setting an item

```typescript
storage.setItem('x', { a: 'this', b: 'can', c: 'be', d: 'anything' });
```

With the default configuration, this will set an item in `localStorage` with the key `empathy` and
no TTL.

### Getting an item

```typescript
const item = storage.getItem('x'); // Returns the item
```

### Removing an item

```typescript
const item = storage.removeItem('x'); // Also returns the item!
```

### Cleaning all items

```typescript
const removedItemCount = storage.clear(); // Returns the number of items that have been removed
```

### Setting and item with TTL

The `setItem` function provides an optional third parameter to specify a time-to-live in
milliseconds:

```typescript
storage.setItem('x', 'value', 50);
```

After the specified time, the item won't be available via `getItem` or `removeItem`. Expired items
are automatically removed from storage to avoid consuming space unnecessarily.
