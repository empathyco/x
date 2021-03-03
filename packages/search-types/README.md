# Changelog

## 7.0.0 - 2021/03/03

> EX-3291 Add `Identifiable` interface to  `Banner`, `Facet`, `Filter`, `Next-queries`, `Promoted`, `Redirection` and `Result`.
> 
> EX-3222 Add `BooleanFilter` and `EditableNumberRange`.
>
> EX-3222 Add `Banner` and `Promoted` to `ModelNameType`.

## 6.0.0 - 2020/01/07

> EX-2521 Remove `BaseFilter` and `Facet` from the possible model names.
>
> EX-2479 Added FacetModelName and FilterModelName types.
>
> EX-2447 Support null value in `parentId` for the `HierarchicalFilter` model.
>
> EX-2320 Refactor Facet & Filter models, renaming fields and splitting in different subtypes.

## 5.0.1 - 2020/09/18

> EX-2152 Fix api-extractor doc model and improve build

## 5.0.0 - 2020/07/30

> EX-1875 Close tags within the documentation between backslashes
>
> EX-1843 Add ESM build keeping also the old CommonJS
>
> EX-1837 Changed next query schema facets to be an array instead of an object.
>
> EX-1693 Unified Suggestion like models properties (RelatedTag, NextQuery, Suggestion, HistoryTerm, PartialResult)
>
> EX-1161 Add type to the attribute `modelName` in the interface `NamedModel`

## 4.0.0 - 2020/02/04

> EX-1506 Add `isWishlisted` field to result model
>
> EX-1437 Add RollupJS build process with document support
>
> EX-1437 Concatenate types in a single file

## 3.1.1

> EX-1540 Update `@empathy/jest-utils` to use minor version

## 3.1.0

> EX-1454 Add optional `callbackInfo` object to Promoted, Banner and Result models

## 3.0.0

> EX-1276 Add `checkout` to `ResultTagging` model
>
> EX-1355 Removed `preselected` property from `Facet`

## 2.0.0

> EX-1240 Removed `entityDetected` and `needParentFilter` properties from `Filter`
