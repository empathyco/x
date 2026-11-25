---
name: x-adapter
description: 'Generic toolkit to build typed API clients (@empathyco/x-adapter): endpointAdapterFactory, createTransformSchema, transformSchemaMapperFactory, fetchHttpClient, buildUrl and interpolate. Use when creating an endpoint adapter for a custom or third-party API, writing request/response mappers or schemas, replacing the HTTP client, or debugging cancelled or wrongly built requests. To customize the existing Empathy Platform endpoints use x-adapter-platform.'
---

<!-- skills-check ignore: httpClient, requestMapper, responseMapper, $subSchema, Response -->

# @empathyco/x-adapter

Framework to create API clients: an endpoint adapter is a function that maps the request,
calls an HTTP client and maps the response.

## Building blocks

- `endpointAdapterFactory({ endpoint, httpClient, requestMapper, responseMapper })` returns an
  endpoint adapter. The result has `.extends(options)` to create a customized copy — prefer it
  over rebuilding the adapter.
- `createTransformSchema({ source?, transform })` creates a `TransformSchema`: `transform` maps
  the source with a function and the optional Zod `source` schema validates it. It adds
  `$extends`, `$override` and `$replace`:
  - `$extends` returns a **new** schema;
  - `$override` and `$replace` **mutate** the schema in place, affecting every adapter that
    uses it.
- `transformSchemaMapperFactory(schema)` creates request/response mappers from a
  `TransformSchema` or a Zod schema.
- **Deprecated:** `schemaMapperFactory` (path based `Schema`, use `transformSchemaMapperFactory`)
  and `createMutableSchema` (use `createTransformSchema`).
- `identityMapper`, `combineMappers` — helper mappers.
- `fetchHttpClient` (parses JSON) and `fetchRawHttpClient` (returns the raw `Response`).
- `buildUrl`, `interpolate` — URL helpers; `interpolate` fills `{param}` placeholders in an
  endpoint such as `https://api.example.com/{id}`, and drops empty ones.

## Common mistakes

- `fetchHttpClient` is cancelable by default: a new request with the same `id` (the endpoint
  by default) aborts the previous one. Pass a distinct `id` or `cancelable: false` for
  requests that must run in parallel.
- Calling `$override` on a shared schema when a copy was intended (use `$extends`).

## More

The package `README.md` (in `node_modules/@empathyco/x-adapter`) has complete examples of
schemas, sub-schemas, transform schemas and `.extends`.
