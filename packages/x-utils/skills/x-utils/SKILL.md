---
name: x-utils
description: "Use when importing, using, or debugging components from x-utils."
---

# x-utils

Paquete de utilidades para el proyecto de búsqueda de Empathy: servicios de sesión y almacenamiento, y helpers para manipular objetos de forma segura.

## Componentes disponibles

- `DefaultSessionService` — servicio de sesión por defecto (implementa `SessionService`).
- `BrowserStorageService` / `InMemoryStorageService` — implementaciones de `StorageService` para `localStorage` y memoria.
- `deepMerge`, `replaceBehaviour`, `deepMergeBehaviour` — fusión profunda de objetos.
- `forEach`, `reduce`, `map`, `cleanUndefined`, `cleanEmpty`, `objectFilter`, `every`, `flatObject`, `rename`, `deepEqual`, `getNewAndUpdatedKeys` — helpers de manipulación de objetos.
- `getSafePropertyChain` — obtiene valores por path de forma segura.
- `isArray`, `isFunction`, `isObject`, `isPath` — type guards.

## Instalación

```
npm install @empathyco/x-utils
```
