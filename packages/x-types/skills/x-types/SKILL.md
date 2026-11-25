---
name: x-types
description: 'Shared data models and type guards of the X ecosystem (@empathyco/x-types): Result, Facet and Filter variants (simple, hierarchical, number range, editable number range, slider), suggestions, banners, tagging, request/response contracts and the XComponentsAdapter interface, plus Vitest schemas to validate them in tests. Use when typing results, facets or filters, narrowing a Filter or Facet with a type guard, adding custom fields to Result via module augmentation, implementing an adapter for a non-Platform API, or validating models in Vitest tests.'
---

# @empathyco/x-types

Type definitions shared by every X package. Almost everything is a type; the runtime exports
are type guards.

## Models

- Results: `Result`, `ResultPrice`, `ResultVariant`.
- Facets: `Facet`, `SimpleFacet`, `HierarchicalFacet`, `NumberRangeFacet`,
  `EditableNumberRangeFacet`, `SliderFacet`.
- Filters: `Filter`, `SimpleFilter`, `HierarchicalFilter`, `BooleanFilter`,
  `NumberRangeFilter`, `EditableNumberRangeFilter`, `SliderFilter`.
- Others: `Suggestion`, `NextQuery`, `RelatedTag`, `RelatedPrompt`, `SemanticQuery`,
  `HistoryQuery`, `Banner`, `Promoted`, `Redirection`, `Sort`, `Tagging`, `Taggable`.
- Adapter contract: `XComponentsAdapter` — implement it to plug a non-Platform API into
  x-components.

Add your own fields to `Result` with module augmentation:

```ts
declare module '@empathyco/x-types' {
  export interface Result {
    season: string
  }
}
```

## Type guards

`isSimpleFilter`, `isHierarchicalFilter`, `isBooleanFilter`, `isNumberRangeFilter`,
`isEditableNumberRangeFilter`, `isSliderFilter`, `isSimpleFacet`, `isHierarchicalFacet`,
`isBooleanFacet`, `isNumberRangeFacet`, `isEditableNumberRangeFacet`, `isSliderFacet`,
`isRawFilter`, `isFacetFilter`.

```ts
import type { Filter } from '@empathyco/x-types'
import { isHierarchicalFilter } from '@empathyco/x-types'

declare const filter: Filter
if (isHierarchicalFilter(filter)) {
  console.log(filter.parentId)
}
```

## Test schemas (Vitest only)

`@empathyco/x-types/schemas` exports reference objects (`ResultSchema`, `FacetSchema`,
`FilterSchema`, `SuggestionSchema`, `RelatedTagSchema`, `NextQuerySchema`, `TaggingSchema`,
`RecommendationSchema`…) and registers custom matchers with `expect.extend`. Import it only
from test files run by **Vitest** — not Jest, and never from production code.

## Exact API

Grep `node_modules/@empathyco/x-types/report/x-types.api.md` before using a name you have not
seen in the project. Breaking changes are listed in the package `CHANGELOG.md`.
