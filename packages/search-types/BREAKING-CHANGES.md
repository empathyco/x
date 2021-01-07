# Changelog

## 6.0.0

> EX-2521 Remove `BaseFilter` and `Facet` from the possible model names.
>
> EX-2320 Split the facet model into `Facet`, `SimpleFacet`, `HierarchicalFacet` and `RangeFacet`.
>
> EX-2320 Split the filter model into `Filter`, `SimpleFilter`, `HierarchicalFilter` and `RangeFilter`. The `Filter` changed the `value` to be always unknown and the `HierarchicalFilter` changed the `parent` and the `facet` properties to be identifier strings.

## 5.0.0

> EX-1837 Changed next query schema facets to be an array instead of an object.
>
> EX-1693 Renamed `term` property to`query` in `HistoryTerm`, `PartialResult` and `Suggestion` models. 
>
> EX-1693 Renamed `resultsFacets` property to `facets` in `NextQuery` model.
>
> EX-1693 Renamed `HistoryTerm` model to `HistoryQuery`,
>
> EX-1693 Renamed `numFound` property to `totalResults` in `PartialResult` and `NextQuery` models.
>
> EX-1693 Remove `id` property from `NextQuery` model. The `query` should be unique, and can be used instead.
>
> EX-1693 Remove `html` field from `Suggestion` and `ResultIdentifier` models. This field should be calculated in the component that consumes the suggestion.

## 4.0.0

> EX-1437 Update TypeScript version to `^3.7.2`
>
> EX-1437 Concatenate types in a single file. Projects that augment the types of this project must update the files location.

