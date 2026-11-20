---
name: x-adapter-platform
description: 'Preconfigured Empathy Platform API adapter (@empathyco/x-adapter-platform): platformAdapter with one endpoint adapter per Platform endpoint and mutable schemas (resultSchema, facetSchema, facetsRequestSchema) customizable with $extends, $override and $replace. Use when changing how an X project calls Empathy Platform: endpoints or environment, extraParams (instance, env), mapping extra result fields (images, prices, variants), or debugging empty or wrongly mapped results and facets. For a non-Platform API use x-adapter.'
---

<!-- skills-check packages: @empathyco/x-adapter-platform, @empathyco/x-adapter, @empathyco/x-types -->
<!-- skills-check ignore: XInstaller, aiSuggestions, Response, extraParams -->

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

Schemas are mutable (`createMutableSchema` from `@empathyco/x-adapter`):

- `resultSchema` maps a Platform result to the X `Result` model.
- `facetSchema` maps facets; `facetsRequestSchema` maps the facets request.
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
  season: 'season',
})
```

## Helpers

`mapFilters`, `getFacetConfig`, `extractUrlParameters`, `getTaggingInfoFromUrl`,
`getDisplayTaggingInfoFromUrl`.

## Exact API

Grep `node_modules/@empathyco/x-adapter-platform/report/x-adapter-platform.api.md` before
using a name you have not seen in the project.
