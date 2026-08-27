---
name: x-adapter
description: "Use when importing, using, or debugging components from x-adapter."
---

# x-adapter

Librería de utilidades para crear un cliente de cualquier API: configura endpoints, mapea peticiones y respuestas (con o sin schemas) y reutiliza mappers.

## Componentes disponibles

- `endpointAdapterFactory` — crea un `EndpointAdapter` (función de petición) a partir de `endpoint`, `httpClient` y mappers.
- `schemaMapperFactory` — genera mappers de petición/respuesta a partir de un `Schema` (dictcionario de paths o funciones).
- `createMutableSchema` — crea un `MutableSchema` reutilizable con los métodos `$extends`, `$override` y `$replace`.
- `identityMapper` / `combineMappers` — mappers auxiliares para identidad y composición.
- `fetchHttpClient` / `fetchRawHttpClient` — clientes HTTP por defecto basados en la Fetch API.
- `buildUrl` / `interpolate` — utilidades para construir URLs y parametrizar endpoints (`https://api/{id}`).

## Instalación

```
npm install @empathyco/x-adapter
```
