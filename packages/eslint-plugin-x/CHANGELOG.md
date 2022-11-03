# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.0-alpha.15](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@2.0.0-alpha.14...@empathyco/eslint-plugin-x@2.0.0-alpha.15) (2022-10-14)

### Continuous Integration

- update `runners` version (#740)
  ([38f246c](https://github.com/empathyco/x/commit/38f246c306dac40c4afbcdea08336052981ca9b8))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.0-alpha.14](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@2.0.0-alpha.13...@empathyco/eslint-plugin-x@2.0.0-alpha.14) (2022-09-27)

### Features

- add `vue devtools` plugin to ease `XEvents` and `wiring` visualization (#215)
  ([bd148ec](https://github.com/empathyco/x/commit/bd148ecb9682f8d4161d278c03f110f8f050d323)),
  closes [EX-7032](https://searchbroker.atlassian.net/browse/EX-7032)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.0-alpha.13](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@2.0.0-alpha.12...@empathyco/eslint-plugin-x@2.0.0-alpha.13) (2022-09-20)

### Features

- Improve tailwindcss types. (#725)
  ([14dec97](https://github.com/empathyco/x/commit/14dec974174cd18e63cb5f4e9a690a9989de44bc)),
  closes [EX-6790](https://searchbroker.atlassian.net/browse/EX-6790)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.0-alpha.12](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@2.0.0-alpha.11...@empathyco/eslint-plugin-x@2.0.0-alpha.12) (2022-09-09)

### Features

- disable `@typescript-eslint/no-extra-parens` rule (#715)
  ([3718017](https://github.com/empathyco/x/commit/3718017c5528156f931bc8b1f2d208cdb50781ed)),
  closes [EX-6996](https://searchbroker.atlassian.net/browse/EX-6996)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.0-alpha.11](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@2.0.0-alpha.10...@empathyco/eslint-plugin-x@2.0.0-alpha.11) (2022-08-03)

### ⚠ BREAKING CHANGES

- **facets:** Removed the `setFilter`mutation from `facets` X-Module. Use `mutateFilter` instead.
- **facets:** Modified the `HierarchicalFilter.children` Model type. Now it is an
  `Array<HierarchicalFilter>` instead of an array of ids.

### Features

- **facets:** Move filters flattening from `x-adapter-platform` to `x-components`. (#626)
  ([2bebaeb](https://github.com/empathyco/x/commit/2bebaeb2863fe794f1b3bea924904651b9302ef6)),
  closes [EX-6484](https://searchbroker.atlassian.net/browse/EX-6484)

### Build System

- sync duplicated dependencies (#567)
  ([912e968](https://github.com/empathyco/x/commit/912e9687851594871b3296a5fb26129327939d96)),
  closes [EX-6412](https://searchbroker.atlassian.net/browse/EX-6412)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.0-alpha.10](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@2.0.0-alpha.9...@empathyco/eslint-plugin-x@2.0.0-alpha.10) (2022-06-06)

### Features

- disable v-slot-style
  ([2e8c2d9](https://github.com/empathyco/x/commit/2e8c2d93605b6a694e84c98f955ee7acfdfd35e3)),
  closes [EX-6284](https://searchbroker.atlassian.net/browse/EX-6284)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.0-alpha.9](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@2.0.0-alpha.8...@empathyco/eslint-plugin-x@2.0.0-alpha.9) (2022-05-11)

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

## [2.0.0-alpha.8](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@2.0.0-alpha.7...@empathyco/eslint-plugin-x@2.0.0-alpha.8) (2022-05-05)

**Note:** Version bump only for package @empathyco/eslint-plugin-x

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.0-alpha.7](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@2.0.0-alpha.6...@empathyco/eslint-plugin-x@2.0.0-alpha.7) (2022-04-29)

### Build System

- **deps:** update eslint-plugin dependencies (#447)
  ([51d60f0](https://github.com/empathyco/x/commit/51d60f0e11fa9667a784bbdb10ba1f39159b382f)),
  closes [EX-5383](https://searchbroker.atlassian.net/browse/EX-5383)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.0-alpha.6](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@2.0.0-alpha.5...@empathyco/eslint-plugin-x@2.0.0-alpha.6) (2022-04-19)

### Features

- **eslint:** add `vuejs-accessibility` plugin (#427)
  ([6789771](https://github.com/empathyco/x/commit/6789771ab88a909552da74095694a4c2a191a51d)),
  closes [EX-5845](https://searchbroker.atlassian.net/browse/EX-5845)
- extract SessionService to x-utils package
  ([5268808](https://github.com/empathyco/x/commit/52688087e577dfd7ce9b0669b21ada75ae67053c))
- **typeguards:** add isPath
  ([3c23ed0](https://github.com/empathyco/x/commit/3c23ed0c094161d787d24b2327d0884e41531878)),
  closes [EX-5802](https://searchbroker.atlassian.net/browse/EX-5802)

### Build System

- **deps:** Upgrade Cypress and Vue Cli plugins versions. (#399)
  ([630d6b0](https://github.com/empathyco/x/commit/630d6b0d767a3484140ecd252e2be10817e0900d)),
  closes [EX-5417](https://searchbroker.atlassian.net/browse/EX-5417)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.0-alpha.5](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@2.0.0-alpha.4...@empathyco/eslint-plugin-x@2.0.0-alpha.5) (2022-03-31)

### Features

- update typescript
  ([73edca6](https://github.com/empathyco/x/commit/73edca61c1cea39d82a7ab94bc18c8bff94c138c)),
  closes [EX-5367](https://searchbroker.atlassian.net/browse/EX-5367)

## [2.0.0-alpha.4](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@2.0.0-alpha.3...@empathyco/eslint-plugin-x@2.0.0-alpha.4) (2022-03-02)

### ⚠ BREAKING CHANGES

- standard-version dependency has been removed from eslint-plugin-x package

### Others

- remove standard-version from eslint-plugin-x
  ([256c9d0](https://github.com/empathyco/x/commit/256c9d051ca1d36cf465fa4ca9a00dfc1d986ae7)),
  closes [EX-5526](https://searchbroker.atlassian.net/browse/EX-5526)

## [2.0.0-alpha.3](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@2.0.0-alpha.2...@empathyco/eslint-plugin-x@2.0.0-alpha.3) (2022-02-28)

### Features

- **url:** set `origin` when navigating
  ([02aa766](https://github.com/empathyco/x/commit/02aa7661a15c3718f4809d094a01b0f684a1f55d)),
  closes [EX-3541](https://searchbroker.atlassian.net/browse/EX-3541)

### Build System

- Fix colors.js dependency issue
  ([2ffcc22](https://github.com/empathyco/x/commit/2ffcc222f5666d7866c8d7cd3a0eec7c0bb1f938)),
  closes [EX-5293](https://searchbroker.atlassian.net/browse/EX-5293)
- update jest dependencies
  ([f3fee15](https://github.com/empathyco/x/commit/f3fee157d724292f5cbb7166908d48ef2fb4fe8c)),
  closes [EX-5027](https://searchbroker.atlassian.net/browse/EX-5027)

## [2.0.0-alpha.2](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@2.0.0-alpha.1...@empathyco/eslint-plugin-x@2.0.0-alpha.2) (2021-11-22)

### Testing

- **search:** redefine old search tests
  ([5142bb5](https://github.com/empathyco/x/commit/5142bb5fb61181f199fa1019cf7c910d9736deb8)),
  closes [EX-3801](https://searchbroker.atlassian.net/browse/EX-3801)

## [2.0.0-alpha.1](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@2.0.0-alpha.0...@empathyco/eslint-plugin-x@2.0.0-alpha.1) (2021-11-03)

### Documentation

- fix readme to reference the correct package
  ([0eaa431](https://github.com/empathyco/x/commit/0eaa431f18a08ba078a15b5e374ce27dd8575c96))

## [2.0.0-alpha.0](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@1.4.0-alpha.7...@empathyco/eslint-plugin-x@2.0.0-alpha.0) (2021-10-25)

### ⚠ BREAKING CHANGES

- **facets:** Rename `Filters` component to `FiltersList`.
- **facets:** Remove `MultiSelectFilters` component. Filters are multi-select by default. Apply the
  `SingleSelectModifier` using the `FilterEntityFactory` to make the desired `Facet` single select.
- **facets:** Refactor `HierarchicalFilter.children` field. Now, this field is a list of the
  `Filter.ids` of the children filter. All `HierarchicalFilter`s are flattened in the
  `Facet.filters` list.
- **facets:** Remove `facets` prop in the `Facets` component to provide `Facets` to the state. Use
  the `FacetsProvider` component instead.
- **facets:** Remove `UserChangedSelectedFilters` event from `Facets` component. Use
  `FacetsProvider` component instead.
- **facets:** Remove `UserClickedClearFacetFilters` event. `UserClickedClearAllFilters` is emitted
  instead. Its payload is now a list of `Facet.id`s.
- **facets:** Rename `UserClickedFacetAllFilter` event to `UserClickedAllFilter`. Its payload is now
  a list of `Facet.id`s.
- **facets:** Remove `BackendFacetsChanged` event. Use `FacetsChanged` event instead.
- **facets:** Remove `BackendFacetsProvided` event. Use `FacetsGroupProvided` instead.
- **facets:** Remove `FrontendFacetsChanged` event. Use `FacetsGroupProvided` instead.
- **facets:** Remove `FacetMultiSelectChanged` event. `Filter`s are multi-select by default. Apply
  the `SingleSelectModifier` using the `FilterEntityFactory` to make the desired `Facet` single
  select.
- **facets:** Change `UserModifiedEditableNumberRangeFilter` payload. Now it is the
  `EditableNumberRangeFilter` filter with the new range value.

### Features

- **facets:** remove old `facets` X Module and replace by `facets-next`.
  ([a47d99f](https://github.com/empathyco/x/commit/a47d99fd9ccbb046c5a5054a92e723f2675b7563)),
  closes [EX-3663](https://searchbroker.atlassian.net/browse/EX-3663)
- **plugin:** minimise initial duplicated requests using a debounce
  ([3ad1fd4](https://github.com/empathyco/x/commit/3ad1fd4ec949de1f1484919d0165f9e6eaa3d882)),
  closes [EX-4718](https://searchbroker.atlassian.net/browse/EX-4718)

### Styling

- add pre-commit hooks to run eslint and prettier
  ([3acc741](https://github.com/empathyco/x/commit/3acc7419b6ece4d7f353d0d1240677271a344bae)),
  closes [EX-4439](https://searchbroker.atlassian.net/browse/EX-4439)

## [1.4.0-alpha.7](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@1.4.0-alpha.6...@empathyco/eslint-plugin-x@1.4.0-alpha.7) (2021-08-05)

**Note:** Version bump only for package @empathyco/eslint-plugin-x

## [1.4.0-alpha.6](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@1.4.0-alpha.5...@empathyco/eslint-plugin-x@1.4.0-alpha.6) (2021-08-05)

### Build System

- upgrade dependencies
  ([b1d0e5d](https://github.com/empathyco/x/commit/b1d0e5df03cd48f3bb285830943bddf9bdc17acf)),
  closes [EX-4506](https://searchbroker.atlassian.net/browse/EX-4506)

## [1.4.0-alpha.5](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@1.4.0-alpha.4...@empathyco/eslint-plugin-x@1.4.0-alpha.5) (2021-08-03)

**Note:** Version bump only for package @empathyco/eslint-plugin-x

## [1.4.0-alpha.4](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@1.4.0-alpha.3...@empathyco/eslint-plugin-x@1.4.0-alpha.4) (2021-07-29)

### Build System

- use 2 different versions of search-types
  ([5a6ac76](https://github.com/empathyco/x/commit/5a6ac76fea26c0f284904d4f514a1370b7c6184b)),
  closes [EX-4477](https://searchbroker.atlassian.net/browse/EX-4477)

## [1.4.0-alpha.3](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@1.4.0-alpha.1...@empathyco/eslint-plugin-x@1.4.0-alpha.3) (2021-07-27)

**Note:** Version bump only for package @empathyco/eslint-plugin-x

## [1.4.0-alpha.2](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@1.4.0-alpha.1...@empathyco/eslint-plugin-x@1.4.0-alpha.2) (2021-07-20)

**Note:** Version bump only for package @empathyco/eslint-plugin-x

## [1.4.0-alpha.1](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@1.4.0-alpha.0...@empathyco/eslint-plugin-x@1.4.0-alpha.1) (2021-07-14)

**Note:** Version bump only for package @empathyco/eslint-plugin-x

# 1.4.0-alpha.0 (2021-06-14)

### Bug Fixes

- **remove-deprecation:** remove deprecation on eqeqeq rule and setup Prettier in the project
  ([e6618a3](https://github.com/empathyco/x/commit/e6618a38505a0a3460a730a0c6ce240add96f360))

### Features

- adapt types to support cypress component testing
  ([7b8e045](https://github.com/empathyco/x/commit/7b8e045f891796b54e03391a562c5f75d4687a65))
- **config:** add initial eslint and third-party plugins, prettier and standard-version
  configurations
  ([c60d0b6](https://github.com/empathyco/x/commit/c60d0b67e9bc2294ce11a3f96307e7e44fde7f7b))
- **import-resolver:** support typescript import resolver
  ([00a4085](https://github.com/empathyco/x/commit/00a4085be186e1cf28b24091fa214e1929ded07a))
- **prettier:** update prettier to version 2.1.2
  ([d413f8d](https://github.com/empathyco/x/commit/d413f8deb5f0675b17140fce9d86d0e3b24dd280))

# [1.3.0](https://github.com/empathyco/x/compare/@empathyco/eslint-plugin-x@1.3.0-alpha.1...@empathyco/eslint-plugin-x@1.3.0) (2021-05-12)

**Note:** Version bump only for package @empathyco/eslint-plugin-x

# 1.3.0-alpha.1 (2021-05-10)

### Bug Fixes

- **remove-deprecation:** remove deprecation on eqeqeq rule and setup Prettier in the project
  ([e6618a3](https://github.com/empathyco/x/commit/e6618a38505a0a3460a730a0c6ce240add96f360))

### Features

- adapt types to support cypress component testing
  ([7b8e045](https://github.com/empathyco/x/commit/7b8e045f891796b54e03391a562c5f75d4687a65))
- **config:** add initial eslint and third-party plugins, prettier and standard-version
  configurations
  ([c60d0b6](https://github.com/empathyco/x/commit/c60d0b67e9bc2294ce11a3f96307e7e44fde7f7b))
- **import-resolver:** support typescript import resolver
  ([00a4085](https://github.com/empathyco/x/commit/00a4085be186e1cf28b24091fa214e1929ded07a))
- **prettier:** update prettier to version 2.1.2
  ([d413f8d](https://github.com/empathyco/x/commit/d413f8deb5f0675b17140fce9d86d0e3b24dd280))

# ESLint Plugin X

## [1.2.1](https://bitbucket.org/colbenson/eslint-plugin-x/branches/compare/v1.2.1%0Dv1.2.0) (2020-12-11)

### Fix

- **prettier:** replaced prettier organize import plugin with import plugin
  ([f84345b](https://bitbucket.org/colbenson/eslint-plugin-x/commits/f84345b767788d00f06bc4f5051b9f414e0b57f0?at=develop)),
  closes [EX-2760](https://searchbroker.atlassian.net/browse/EX-2760)

## [1.2.0](https://bitbucket.org/colbenson/eslint-plugin-x/branches/compare/v1.2.0%0Dv1.1.0) (2020-09-30)

### Features

- **prettier:** update prettier to version 2.1.2
  ([0395e88](https://bitbucket.org/colbenson/eslint-plugin-x/commits/0395e880c656db816578a9fc2bc8091adbc18f43)),
  closes [EX-2239](https://searchbroker.atlassian.net/browse/EX-2239)

## [1.1.0](https://bitbucket.org/colbenson/eslint-plugin-x/branches/compare/v1.1.0%0Dv1.0.0) (2020-09-17)

### Features

- **import-resolver:** support typescript import resolver
  ([f58616d](https://bitbucket.org/colbenson/eslint-plugin-x/commits/f58616df2568cfb5abef03cd7dc459629883e39f)),
  closes [EX-2187](https://searchbroker.atlassian.net/browse/EX-2187)

## 1.0.0 (2020-06-18)

### Features

- **config:** add initial eslint and third-party plugins, prettier and standard-version
  configurations
  ([079f20e](https://bitbucket.org/colbenson/eslint-plugin-x/commits/079f20e18c8364d99261a7a7dc7255d2ed634357)),
  closes [EX-1946](https://searchbroker.atlassian.net/browse/EX-1946)
