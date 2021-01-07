# Search Adapter Changelog

## 5.0.0

> EX-2413 Rename `facetName` and `noTagFacetName` by `facetId` and `noTagFacetId` respectively in the `FacetConfig.prefix`.
>
> EX-2413 Replace `DEPENDENCIES.ResponseMappers.filters` by specific ones `DEPENDENCIES.ResponseMappers.simpleFilter`, `DEPENDENCIES.ResponseMappers.hierarchicalFilter` and `DEPENDENCIES.ResponseMappers.numberRangeFilter`.
>
> EX-2413 Remove `filterDeepness` and `facetName` from `FilterValueMapperParams` interface. Now the facet name can be got from the `filter` as `facetId` property.
>
> EX-2413 Replace `filterModelName` prop by `modelName` in the `FacetConfig` interface. Now it has the `FacetModelName` type.

## 4.0.0

> EX-1837 Change next query mapper facets to be an array instead of an object.
>
> EX-1641 Change default search endpoint from `api{env}.empathybroker.com/search/v1/query/{instance}/search` to `api{env}.empathybroker.com/search/v1/query/{instance}/searchX`
>
> EX-1693 Update to `@empathy/search-types` version to `5.0.0`
>
> EX-1693 Remove `EmpathyQueryHighlightingMapper`. This logic should now be handled by components if needed
>
> EX-1693 Remove `id` mapping in `EmpathyNextQueryMapper`. Use the `query` property if you need an id
>
> EX-1693 Rename `resultsFacets` to `facets` and `numFound` to `totalResults` mappings in `EmpathyNextQueryMapper`
>
> EX-1693 Rename `term` to `query` and `numFound` to `totalResults` mappings in `EmpathyPartialResultMapper`
>
> EX-1693 Remove `identifier.html` mapping from `EmpathyResultMapper`. This property should be calculated in the component
>
> EX-1693 Remove `html` mapping from `EmpathySuggestionMapper`. This property should be calculated in the component
>
> EX-1693 Rename `term` to `query` mapping in `EmpathySuggestionMapper`
>
> EX-1693 Change `modelName` mapping value from `Suggestion` to `QuerySuggestion` or `PopularSearch` in `EmpathySuggestionMapper` depending if the request had query or not

## 3.0.0

> EX-1355 Removed `preselected` property
>
> Rename `SearchAdapter#getRecommendations` to `SearchAdapter#getTopRecommendations`
