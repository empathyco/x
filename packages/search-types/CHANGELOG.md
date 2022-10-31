# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.39](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.38...@empathyco/x-types@10.0.0-alpha.39) (2022-10-21)

### ⚠ BREAKING CHANGES

- **tagging:** `tagging` property of `Taggable` and `queryTagging` property of `SearchResponse` are
  optional.

### Features

- **tagging:** make `tagging` and `queryTagging` optional (#797)
  ([0e49156](https://github.com/empathyco/x/commit/0e49156308d4e77d667a2191697101674cdbf213)),
  closes [EX-7231](https://searchbroker.atlassian.net/browse/EX-7231)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.38](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.37...@empathyco/x-types@10.0.0-alpha.38) (2022-10-14)

### Continuous Integration

- update `runners` version (#740)
  ([38f246c](https://github.com/empathyco/x/commit/38f246c306dac40c4afbcdea08336052981ca9b8))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.37](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.36...@empathyco/x-types@10.0.0-alpha.37) (2022-09-27)

**Note:** Version bump only for package @empathyco/x-types

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.36](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.35...@empathyco/x-types@10.0.0-alpha.36) (2022-09-16)

**Note:** Version bump only for package @empathyco/x-types

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.35](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.34...@empathyco/x-types@10.0.0-alpha.35) (2022-09-13)

**Note:** Version bump only for package @empathyco/x-types

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.34](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.33...@empathyco/x-types@10.0.0-alpha.34) (2022-09-09)

**Note:** Version bump only for package @empathyco/x-types

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.33](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.32...@empathyco/x-types@10.0.0-alpha.33) (2022-08-24)

**Note:** Version bump only for package @empathyco/x-types

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.32](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.31...@empathyco/x-types@10.0.0-alpha.32) (2022-08-19)

**Note:** Version bump only for package @empathyco/x-types

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.31](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.30...@empathyco/x-types@10.0.0-alpha.31) (2022-08-10)

### ⚠ BREAKING CHANGES

- **result:** `Result` model properties are optional, except `id`, `modelName` and `tagging`.

### Features

- **result:** add `variants` support (#644)
  ([d5db09e](https://github.com/empathyco/x/commit/d5db09e9be92d0df65329680ee286959030ccecc)),
  closes [EX-6760](https://searchbroker.atlassian.net/browse/EX-6760)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.30](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.29...@empathyco/x-types@10.0.0-alpha.30) (2022-08-03)

### ⚠ BREAKING CHANGES

- **facets:** Removed the `setFilter`mutation from `facets` X-Module. Use `mutateFilter` instead.
- **facets:** Modified the `HierarchicalFilter.children` Model type. Now it is an
  `Array<HierarchicalFilter>` instead of an array of ids.

### Features

- **facets:** Move filters flattening from `x-adapter-platform` to `x-components`. (#626)
  ([2bebaeb](https://github.com/empathyco/x/commit/2bebaeb2863fe794f1b3bea924904651b9302ef6)),
  closes [EX-6484](https://searchbroker.atlassian.net/browse/EX-6484)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.29](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.28...@empathyco/x-types@10.0.0-alpha.29) (2022-07-28)

### Features

- **next-queries:** add next query preview logic (#611)
  ([fc611fa](https://github.com/empathyco/x/commit/fc611faa39e63e5f916cd19928e9ab0755f8dc7f)),
  closes [EX-6119](https://searchbroker.atlassian.net/browse/EX-6119)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.28](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.27...@empathyco/x-types@10.0.0-alpha.28) (2022-07-26)

**Note:** Version bump only for package @empathyco/x-types

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.27](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.26...@empathyco/x-types@10.0.0-alpha.27) (2022-06-24)

**Note:** Version bump only for package @empathyco/x-types

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.26](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.25...@empathyco/x-types@10.0.0-alpha.26) (2022-06-23)

### Bug Fixes

- Remove `@empathyco/x-platform-adapter` dependency from library code. (#575)
  ([104c7e1](https://github.com/empathyco/x/commit/104c7e10855a67b2adfa68d42d82431f9194ee15)),
  closes [EX-6437](https://searchbroker.atlassian.net/browse/EX-6437)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.25](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.24...@empathyco/x-types@10.0.0-alpha.25) (2022-06-16)

### Code Refactoring

- make extra params optional (#553)
  ([ef7493a](https://github.com/empathyco/x/commit/ef7493a00a4da73f544f3a32b9e8a1fd68ba23a0)),
  closes [EX-6335](https://searchbroker.atlassian.net/browse/EX-6335)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.24](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.23...@empathyco/x-types@10.0.0-alpha.24) (2022-06-09)

### Bug Fixes

- fix request types
  ([7998113](https://github.com/empathyco/x/commit/79981132fc510ee7a313393ad98b67caac2b6c7b)),
  closes [EX-6302](https://searchbroker.atlassian.net/browse/EX-6302)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.23](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.22...@empathyco/x-types@10.0.0-alpha.23) (2022-05-13)

### Features

- move `response` types to `@empathyco/x-types`
  ([77fb812](https://github.com/empathyco/x/commit/77fb812b77fe0c84462a4b5b2eb7f0439e2d8061)),
  closes [EX-6092](https://searchbroker.atlassian.net/browse/EX-6092)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.22](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.21...@empathyco/x-types@10.0.0-alpha.22) (2022-05-11)

### ⚠ BREAKING CHANGES

- Request types moved to `x-types` package. Change the imports from `x-adapter` to `x-type`.
- Removed `TaggingInfo` type. Use `TaggingRequest` from `@empathyco/x-types` instead.

### Features

- move `Request` types to `x-types` package
  ([7cc85c1](https://github.com/empathyco/x/commit/7cc85c1d371b604b3188d8cc2076eab5fc9460e4)),
  closes [EX-6066](https://searchbroker.atlassian.net/browse/EX-6066)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.21](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.20...@empathyco/x-types@10.0.0-alpha.21) (2022-04-29)

**Note:** Version bump only for package @empathyco/x-types

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0-alpha.20](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.19...@empathyco/x-types@10.0.0-alpha.20) (2022-03-31)

**Note:** Version bump only for package @empathyco/x-types

## [10.0.0-alpha.19](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.18...@empathyco/x-types@10.0.0-alpha.19) (2022-03-11)

### ⚠ BREAKING CHANGES

- Remove `selected` and `previous` logic from related tags.
- Remove `EmpathyRequestRelatedTagsQueryMapper`.

### Features

- move related tags concatenation logic (#365)
  ([4e71797](https://github.com/empathyco/x/commit/4e717970198f67018a9b66ed6e47f511ecef4c62)),
  closes [EX-5410](https://searchbroker.atlassian.net/browse/EX-5410)

## [10.0.0-alpha.18](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.17...@empathyco/x-types@10.0.0-alpha.18) (2022-03-08)

### Features

- update typescript
  ([73edca6](https://github.com/empathyco/x/commit/73edca61c1cea39d82a7ab94bc18c8bff94c138c)),
  closes [EX-5367](https://searchbroker.atlassian.net/browse/EX-5367)

## [10.0.0-alpha.17](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.16...@empathyco/x-types@10.0.0-alpha.17) (2022-02-28)

**Note:** Version bump only for package @empathyco/x-types

## [10.0.0-alpha.16](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.15...@empathyco/x-types@10.0.0-alpha.16) (2022-02-17)

### Features

- **design-system:** add `curated` modifier to the `suggestion`
  ([dd229fd](https://github.com/empathyco/x/commit/dd229fd3d64840ed3041bec618a1a23e3726430d)),
  closes [EX-5290](https://searchbroker.atlassian.net/browse/EX-5290)

## [10.0.0-alpha.15](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.14...@empathyco/x-types@10.0.0-alpha.15) (2022-02-08)

### Build System

- Fix colors.js dependency issue
  ([2ffcc22](https://github.com/empathyco/x/commit/2ffcc222f5666d7866c8d7cd3a0eec7c0bb1f938)),
  closes [EX-5293](https://searchbroker.atlassian.net/browse/EX-5293)

### Continuous Integration

- update rollup and plugins version
  ([d240f3d](https://github.com/empathyco/x/commit/d240f3de8bc3e226d0bd8ac2d9bd4282cc660b86)),
  closes [EX-5342](https://searchbroker.atlassian.net/browse/EX-5342)

## [10.0.0-alpha.14](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.13...@empathyco/x-types@10.0.0-alpha.14) (2021-12-29)

### Features

- **next-queries:** add `isCurated` property to `NextQuery` model
  ([fdd89f8](https://github.com/empathyco/x/commit/fdd89f84afe7e328cdcd121288142dc82e2000c8)),
  closes [EX-5152](https://searchbroker.atlassian.net/browse/EX-5152)

## [10.0.0-alpha.13](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.12...@empathyco/x-types@10.0.0-alpha.13) (2021-11-30)

### Features

- **related-tags:** add `isCurated` property to related tags
  ([e063f45](https://github.com/empathyco/x/commit/e063f4560573bcb1bf32fbe49753f2fe6b235cc7)),
  closes [EX-4940](https://searchbroker.atlassian.net/browse/EX-4940)

## [10.0.0-alpha.12](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.11...@empathyco/x-types@10.0.0-alpha.12) (2021-11-29)

### Build System

- update jest dependencies
  ([f3fee15](https://github.com/empathyco/x/commit/f3fee157d724292f5cbb7166908d48ef2fb4fe8c)),
  closes [EX-5027](https://searchbroker.atlassian.net/browse/EX-5027)

## [10.0.0-alpha.11](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.10...@empathyco/x-types@10.0.0-alpha.11) (2021-11-22)

### Features

- make `Identifiable` type generic
  ([6de6ab2](https://github.com/empathyco/x/commit/6de6ab270f5f2018468e56f5d3df4eb227853413)),
  closes [EX-5001](https://searchbroker.atlassian.net/browse/EX-5001)
- update `Tagging` model
  ([598915c](https://github.com/empathyco/x/commit/598915ced128e3fa5586ff6c870e68cfa2e016c3)),
  closes [EX-4985](https://searchbroker.atlassian.net/browse/EX-4985)

## [10.0.0-alpha.10](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.9...@empathyco/x-types@10.0.0-alpha.10) (2021-10-25)

### Features

- **plugin:** minimise initial duplicated requests using a debounce
  ([3ad1fd4](https://github.com/empathyco/x/commit/3ad1fd4ec949de1f1484919d0165f9e6eaa3d882)),
  closes [EX-4718](https://searchbroker.atlassian.net/browse/EX-4718)

### Styling

- add pre-commit hooks to run eslint and prettier
  ([3acc741](https://github.com/empathyco/x/commit/3acc7419b6ece4d7f353d0d1240677271a344bae)),
  closes [EX-4439](https://searchbroker.atlassian.net/browse/EX-4439)

## [10.0.0-alpha.9](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.8...@empathyco/x-types@10.0.0-alpha.9) (2021-09-22)

### Code Refactoring

- use `NamedModel` generic parameter to better type models
  ([4255c94](https://github.com/empathyco/x/commit/4255c94c05b497272409fcba745c29cd8b0d870a)),
  closes [EX-4734](https://searchbroker.atlassian.net/browse/EX-4734)

## [10.0.0-alpha.8](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.7...@empathyco/x-types@10.0.0-alpha.8) (2021-09-15)

### Features

- **search:** save `Redirection`'s entities
  ([cdba4a6](https://github.com/empathyco/x/commit/cdba4a656f7cea74115d06173151d450657d1aed)),
  closes [EX-4730](https://searchbroker.atlassian.net/browse/EX-4730)

## [10.0.0-alpha.7](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.6...@empathyco/x-types@10.0.0-alpha.7) (2021-08-05)

**Note:** Version bump only for package @empathyco/x-types

## [10.0.0-alpha.6](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.5...@empathyco/x-types@10.0.0-alpha.6) (2021-08-05)

**Note:** Version bump only for package @empathyco/x-types

## [10.0.0-alpha.5](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.4...@empathyco/x-types@10.0.0-alpha.5) (2021-08-03)

### Build System

- Update TypeScript to 4.3.5.Update TSLib to 2.3.5.
  ([4cebdfc](https://github.com/empathyco/x/commit/4cebdfc11e1520552a687def3eda1bf0c132e031)),
  closes [EX-4435](https://searchbroker.atlassian.net/browse/EX-4435)

## [10.0.0-alpha.4](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.3...@empathyco/x-types@10.0.0-alpha.4) (2021-07-29)

### Build System

- use 2 different versions of search-types
  ([5a6ac76](https://github.com/empathyco/x/commit/5a6ac76fea26c0f284904d4f514a1370b7c6184b)),
  closes [EX-4477](https://searchbroker.atlassian.net/browse/EX-4477)

## [10.0.0-alpha.3](https://github.com/empathyco/x/compare/@empathyco/x-types@10.0.0-alpha.2...@empathyco/x-types@10.0.0-alpha.3) (2021-07-28)

### Styling

- add @empathyco/eslint-plugin-x dependency linting and formatting code
  ([35efd55](https://github.com/empathyco/x/commit/35efd554d134e351e9b089ddaa29c52c34bac3c9)),
  closes [EX-4313](https://searchbroker.atlassian.net/browse/EX-4313)

## [10.0.0-alpha.2](https://github.com/empathyco/x/compare/@empathyco/x-types@9.1.0-alpha.1...@empathyco/x-types@10.0.0-alpha.2) (2021-07-27)

### Bug Fixes

- **x-types:** Fix filters models inheritance. (#51)
  ([01b6b1e](https://github.com/empathyco/x/commit/01b6b1e1841deaab84c2c090d26a7e25102252c7)),
  closes [EX-4449](https://searchbroker.atlassian.net/browse/EX-4449)

## [9.1.0-alpha.2](https://github.com/empathyco/x/compare/@empathyco/x-types@9.1.0-alpha.1...@empathyco/x-types@9.1.0-alpha.2) (2021-07-20)

**Note:** Version bump only for package @empathyco/x-types

## [9.1.0-alpha.1](https://github.com/empathyco/x/compare/@empathyco/x-types@9.1.0-alpha.0...@empathyco/x-types@9.1.0-alpha.1) (2021-07-20)

### Continuous Integration

- Fix publishing in x-components. Normalize build scripts. (#46)
  ([c3c2f85](https://github.com/empathyco/x/commit/c3c2f8519c0de1b164074e87e68e77ad1af0d702)),
  closes [EX-4413](https://searchbroker.atlassian.net/browse/EX-4413)

## 9.1.0-alpha.0 (2021-07-14)

### Features

- prepare `search-types` for the mono-repo
  ([67cd79f](https://github.com/empathyco/x/commit/67cd79fd2d17f49ed9a49c74b316651fb55203df)),
  closes [EX-3850](https://searchbroker.atlassian.net/browse/EX-3850)
- update `search-types` package information
  ([465da36](https://github.com/empathyco/x/commit/465da36630a3e4545f2eadff540dbf3ae9de0d0a)),
  closes [EX-3934](https://searchbroker.atlassian.net/browse/EX-3934)

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

> EX-3291 Add `Identifiable` interface to `Banner`, `Facet`, `Filter`, `Next-queries`, `Promoted`,
> `Redirection` and `Result`.
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
> EX-1693 Unified Suggestion like models properties (RelatedTag, NextQuery, Suggestion, HistoryTerm,
> PartialResult)
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
