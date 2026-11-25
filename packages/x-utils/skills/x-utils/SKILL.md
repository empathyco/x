---
name: x-utils
description: 'Utilities shared by the X packages (@empathyco/x-utils): deepMerge with merge behaviours, safe object helpers (forEach, map, reduce, cleanEmpty, cleanUndefined, objectFilter, flatObject, deepEqual, getSafePropertyChain) and session/storage services (DefaultSessionService, BrowserStorageService, InMemoryStorageService). Use when merging configuration objects, reading nested values safely, persisting data in browser storage, or debugging config that loses keys after a merge.'
---

<!-- skills-check ignore: Storage -->

# @empathyco/x-utils

Small helpers used across X. Prefer them over re-implementing the same logic in the project.

## deepMerge (read before using)

`deepMerge(target, ...sources)`:

- **mutates and returns `target`** — pass `{}` first to get a new object;
- a source key with value `undefined` **deletes** that key from the target;
- arrays are replaced (copied), not merged;
- `replaceBehaviour(obj)` / `deepMergeBehaviour(obj)` mark an object so the next merge
  replaces it or deep-merges it; they are markers, not merge functions.

## Object helpers

`forEach`, `reduce`, `map`, `cleanUndefined`, `cleanEmpty`, `objectFilter`, `every`,
`flatObject`, `rename`, `deepEqual`, `getNewAndUpdatedKeys`, `getSafePropertyChain` (reads a
value by path without throwing). Type guards: `isArray`, `isFunction`, `isObject`, `isPath`.

## Services

- `DefaultSessionService` implements `SessionService` (session id with a TTL); use its shared
  `DefaultSessionService.instance`.
- `BrowserStorageService` implements `StorageService` over any `Storage` (local or session
  storage) with a key prefix; `InMemoryStorageService` is the in-memory version (tests, SSR).
