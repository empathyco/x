# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.2](https://github.com/empathyco/x/compare/@empathyco/x-types@9.1.0-alpha.1...@empathyco/x-types@10.0.0-alpha.2) (2021-07-27)


### Bug Fixes

* **x-types:** Fix filters models inheritance. (#51) ([01b6b1e](https://github.com/empathyco/x/commit/01b6b1e1841deaab84c2c090d26a7e25102252c7)), closes [EX-4449](https://searchbroker.atlassian.net/browse/EX-4449)



## [9.1.0-alpha.2](https://github.com/empathyco/x/compare/@empathyco/x-types@9.1.0-alpha.1...@empathyco/x-types@9.1.0-alpha.2) (2021-07-20)

**Note:** Version bump only for package @empathyco/x-types





## [9.1.0-alpha.1](https://github.com/empathyco/x/compare/@empathyco/x-types@9.1.0-alpha.0...@empathyco/x-types@9.1.0-alpha.1) (2021-07-20)


### Continuous Integration

* Fix publishing in x-components. Normalize build scripts. (#46) ([c3c2f85](https://github.com/empathyco/x/commit/c3c2f8519c0de1b164074e87e68e77ad1af0d702)), closes [EX-4413](https://searchbroker.atlassian.net/browse/EX-4413)



## 9.1.0-alpha.0 (2021-07-14)


### Features

* prepare `search-types` for the mono-repo ([67cd79f](https://github.com/empathyco/x/commit/67cd79fd2d17f49ed9a49c74b316651fb55203df)), closes [EX-3850](https://searchbroker.atlassian.net/browse/EX-3850)
* update `search-types` package information ([465da36](https://github.com/empathyco/x/commit/465da36630a3e4545f2eadff540dbf3ae9de0d0a)), closes [EX-3934](https://searchbroker.atlassian.net/browse/EX-3934)



## 9.0.0 - 2021/05/19

> EX-3917 Change `HierarchicalFilter` `children` prop to be optional.

## 8.0.0 - 2021/04/16

> EX-3347 Remove `MultiSelect` model.
> 
> EX-3347 Add type guards for filters and facets models.
> 
> EX-3347 Change `BooleanFilterModelName` to support any string.
> 
> EX-3300 Transform `Sort` model into a string.
> 
> EX-3473 Make `BooleanFilter`'s `totalResults` property optional.

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
