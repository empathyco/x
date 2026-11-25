---
name: x-adapter-platform
description: 'Preconfigured Empathy Platform API adapter (@empathyco/x-adapter-platform): platformAdapter with one endpoint adapter per Platform endpoint and transform schemas (resultSchema, facetSchema, etc.) customizable with $extends, $override and $replace. Use when changing how an X project calls Empathy Platform: endpoints or environment, extraParams (instance, env), mapping extra result fields (images, prices, variants), or debugging empty or wrongly mapped results and facets. For a non-Platform API use x-adapter.'
---

<!-- skills-check packages: @empathyco/x-adapter-platform, @empathyco/x-adapter, @empathyco/x-types -->
<!-- skills-check ignore: XInstaller, aiSuggestions, Response, extraParams, safeParse -->

# @empathyco/x-adapter-platform

Adapter for the Empathy Platform API, built on `@empathyco/x-adapter`. It is the adapter
passed to `XInstaller` in most X projects.

## platformAdapter

`platformAdapter` has one endpoint adapter per Platform endpoint: search, browse, facets,
popularSearches, recommendations (top clicked products), nextQueries, querySuggestions,
relatedTags, relatedPrompts, semanticQueries, identifierResults (search by SKU),
experienceControls, aiSuggestions, aiSuggestionsSearch and tagging.

- `aiSuggestions` returns the raw streaming `Response` (server-sent events), not mapped data.
- Endpoint URLs are built from the request `extraParams`: `instance` (all endpoints) and `env`
  (for example `env: 'test'` points search to the internal test host).

## Customizing the mapping

Schemas are `TransformSchema`s (`createTransformSchema` from `@empathyco/x-adapter`); the old path based mutable schemas are deprecated:

- `resultSchema` maps a Platform result to the X `Result` model.
- `facetSchema` maps facets; request and response schemas are also `TransformSchema`s.
- `$extends` returns a new schema; `$override` and `$replace` **mutate the shared schema**, so
  every endpoint using it changes.

Adding a field to results (from the package README, "Modifying the x-platform-adapter"):

```ts
import type { PlatformResult } from '@empathyco/x-adapter-platform'
import type { Result } from '@empathyco/x-types'
import { resultSchema } from '@empathyco/x-adapter-platform'

interface MyPlatformResult extends PlatformResult {
  season: string
}

declare module '@empathyco/x-types' {
  export interface Result {
    season: string
  }
}

resultSchema.$override<MyPlatformResult, Partial<Result>>({
  // The returned object is merged with the result mapped by default.
  transform: source => ({ season: source.season }),
})
```

Validating the extra fields (optional): a modification accepts a `source` validator, any object
with `safeParse` such as a Zod schema. The package does not depend on Zod: install `zod@^4` in the
project (`z.looseObject` and `zod/mini` do not exist in Zod 3). Types are inferred from it:

```ts
import * as z from 'zod/mini'

resultSchema.$override({
  source: z.looseObject({ season: z.string() }),
  transform: source => ({ season: source.season }),
})
```

If the source does not match, a warning is logged and the raw source is mapped anyway.

## Common mistakes

- The object returned by `transform` is **shallow merged** with the already mapped one (second
  parameter). To change a nested field return the whole object: `price: { ...result.price, tax }`.
- Properties returned as `undefined` are ignored, so `$override` cannot remove a mapped property.
  Use `$replace` to define the whole schema instead.
- Path based overrides (`$override({ season: 'season' })`) no longer work: write a `transform`
  function.
- `$override` and `$replace` change the shared schema for every endpoint; use `$extends` for a copy.
- `getFacetConfig(type).schema` is a `TransformSchema` too: use `schema.$extends({ transform })`.
- Use `z.looseObject()` (not `z.object()`) in `source`, to describe only the fields you need.

## Helpers

`mapFilters`, `getFacetConfig`, `extractUrlParameters`, `getTaggingInfoFromUrl`,
`getDisplayTaggingInfoFromUrl`.

## Exact API

Grep `node_modules/@empathyco/x-adapter-platform/report/x-adapter-platform.api.md` before
using a name you have not seen in the project.
