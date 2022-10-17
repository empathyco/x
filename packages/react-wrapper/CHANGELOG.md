# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.0-alpha.8](https://github.com/empathyco/x/compare/@empathyco/x-react-wrapper@4.0.0-alpha.7...@empathyco/x-react-wrapper@4.0.0-alpha.8) (2022-10-14)

### Continuous Integration

- update `runners` version (#740)
  ([38f246c](https://github.com/empathyco/x/commit/38f246c306dac40c4afbcdea08336052981ca9b8))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.0-alpha.7](https://github.com/empathyco/x/compare/@empathyco/x-react-wrapper@4.0.0-alpha.6...@empathyco/x-react-wrapper@4.0.0-alpha.7) (2022-09-09)

### Features

- disable `@typescript-eslint/no-extra-parens` rule (#715)
  ([3718017](https://github.com/empathyco/x/commit/3718017c5528156f931bc8b1f2d208cdb50781ed)),
  closes [EX-6996](https://searchbroker.atlassian.net/browse/EX-6996)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.0-alpha.6](https://github.com/empathyco/x/compare/@empathyco/x-react-wrapper@4.0.0-alpha.5...@empathyco/x-react-wrapper@4.0.0-alpha.6) (2022-08-31)

### Build System

- **dependencies:** fix Vue & Vuex versions (#686)
  ([177e851](https://github.com/empathyco/x/commit/177e8511f4458fa13c627210cdfbbf6d42a85b17)),
  closes [EX-6918](https://searchbroker.atlassian.net/browse/EX-6918)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.0-alpha.5](https://github.com/empathyco/x/compare/@empathyco/x-react-wrapper@4.0.0-alpha.4...@empathyco/x-react-wrapper@4.0.0-alpha.5) (2022-04-04)

### Build System

- **deps:** Upgrade Cypress and Vue Cli plugins versions. (#399)
  ([630d6b0](https://github.com/empathyco/x/commit/630d6b0d767a3484140ecd252e2be10817e0900d)),
  closes [EX-5417](https://searchbroker.atlassian.net/browse/EX-5417)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.0-alpha.4](https://github.com/empathyco/x/compare/@empathyco/x-react-wrapper@4.0.0-alpha.3...@empathyco/x-react-wrapper@4.0.0-alpha.4) (2022-03-31)

**Note:** Version bump only for package @empathyco/x-react-wrapper

## [4.0.0-alpha.3](https://github.com/empathyco/x/compare/@empathyco/x-react-wrapper@4.0.0-alpha.2...@empathyco/x-react-wrapper@4.0.0-alpha.3) (2022-03-08)

### Features

- update typescript
  ([73edca6](https://github.com/empathyco/x/commit/73edca61c1cea39d82a7ab94bc18c8bff94c138c)),
  closes [EX-5367](https://searchbroker.atlassian.net/browse/EX-5367)

### Build System

- Fix colors.js dependency issue
  ([2ffcc22](https://github.com/empathyco/x/commit/2ffcc222f5666d7866c8d7cd3a0eec7c0bb1f938)),
  closes [EX-5293](https://searchbroker.atlassian.net/browse/EX-5293)

## [4.0.0-alpha.2](https://github.com/empathyco/x/compare/@empathyco/x-react-wrapper@4.0.0-alpha.1...@empathyco/x-react-wrapper@4.0.0-alpha.2) (2021-11-29)

### Build System

- update jest dependencies
  ([f3fee15](https://github.com/empathyco/x/commit/f3fee157d724292f5cbb7166908d48ef2fb4fe8c)),
  closes [EX-5027](https://searchbroker.atlassian.net/browse/EX-5027)

## [4.0.0-alpha.1](https://github.com/empathyco/x/compare/@empathyco/x-react-wrapper@4.0.0-alpha.0...@empathyco/x-react-wrapper@4.0.0-alpha.1) (2021-10-25)

### Features

- **plugin:** minimise initial duplicated requests using a debounce
  ([3ad1fd4](https://github.com/empathyco/x/commit/3ad1fd4ec949de1f1484919d0165f9e6eaa3d882)),
  closes [EX-4718](https://searchbroker.atlassian.net/browse/EX-4718)

### Styling

- add pre-commit hooks to run eslint and prettier
  ([3acc741](https://github.com/empathyco/x/commit/3acc7419b6ece4d7f353d0d1240677271a344bae)),
  closes [EX-4439](https://searchbroker.atlassian.net/browse/EX-4439)

## [4.0.0-alpha.0](https://github.com/empathyco/x/compare/@empathyco/x-react-wrapper@3.1.0-alpha.2...@empathyco/x-react-wrapper@4.0.0-alpha.0) (2021-09-22)

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

## [3.1.0-alpha.2](https://github.com/empathyco/x/compare/@empathyco/x-react-wrapper@3.1.0-alpha.1...@empathyco/x-react-wrapper@3.1.0-alpha.2) (2021-08-05)

**Note:** Version bump only for package @empathyco/x-react-wrapper

## [3.1.0-alpha.1](https://github.com/empathyco/x/compare/@empathyco/x-react-wrapper@3.1.0-alpha.0...@empathyco/x-react-wrapper@3.1.0-alpha.1) (2021-08-05)

### Features

- **facets-next:** add `HierarchicalFilterEntity` (#75)
  ([d633721](https://github.com/empathyco/x/commit/d633721b6c795ee9145925d366216edd616b0807)),
  closes [EX-4354](https://searchbroker.atlassian.net/browse/EX-4354)

### Build System

- upgrade dependencies
  ([b1d0e5d](https://github.com/empathyco/x/commit/b1d0e5df03cd48f3bb285830943bddf9bdc17acf)),
  closes [EX-4506](https://searchbroker.atlassian.net/browse/EX-4506)

## [3.1.0-alpha.0](https://github.com/empathyco/x/compare/@empathyco/x-react-wrapper@3.0.1-alpha.1...@empathyco/x-react-wrapper@3.1.0-alpha.0) (2021-08-03)

### Build System

- Update TypeScript to 4.3.5.Update TSLib to 2.3.5.
  ([4cebdfc](https://github.com/empathyco/x/commit/4cebdfc11e1520552a687def3eda1bf0c132e031)),
  closes [EX-4435](https://searchbroker.atlassian.net/browse/EX-4435)

### [3.0.1-alpha.1](https://github.com/empathyco/x/compare/@empathyco/x-react-wrapper@3.0.1-alpha.0...@empathyco/x-react-wrapper@3.0.1-alpha.1) (2021-07-29)

**Note:** Version bump only for package @empathyco/x-react-wrapper

### 3.0.1-alpha.0 (2021-07-28)

**Note:** Version bump only for package @empathyco/x-react-wrapper

# React Wrapper

## [3.0.0](https://bitbucket.org/colbenson/react-wrapper/branches/compare/v3.0.0%0Dv2.0.0) (2021-02-18)

### Features

- **slots:** support using standard React components inside slots
  ([489cc0c](https://bitbucket.org/colbenson/react-wrapper/commits/489cc0cfa8eab5e71233bba541bf2257d3bbbaa0)),
  closes [EX-2901](https://searchbroker.atlassian.net/browse/EX-2901)

### ⚠ BREAKING CHANGES

- **slots:** Scoped slots do not longer support primitive properties. They can only pass objects
  with named props.

## [2.0.0](https://bitbucket.org/colbenson/react-wrapper/branches/compare/v2.0.0%0Dv1.0.4) (2021-01-05)

### ⚠ BREAKING CHANGES

- **slots:** ReactWrapper slots renders a wrapper `div` with the class `react-wrapper-slot`.
- **react-wrapper:** ReactWrapper component now renders a `div` with the class `react-wrapper`.
  Inside this `div` the vue content is rendered. You can pass custom CSS classes to this div using
  the `className` prop.

### Bug Fixes

- **react-wrapper:** make react-wrapper render a wrapper div so sibling elements can be properly
  updated.
  ([e1dab57](https://bitbucket.org/colbenson/react-wrapper/commits/e1dab576e2d66f73e075e85abcf0396a69201dc3)),
  closes [EX-2809](https://searchbroker.atlassian.net/browse/EX-2809)
- **slots:** make react-wrapper slots render a wrapper div so children can be properly updated.
  ([ddf0f55](https://bitbucket.org/colbenson/react-wrapper/commits/ddf0f551bd4f19c1beaf737c5e5a50d3f5e24302)),
  closes [EX-2854](https://searchbroker.atlassian.net/browse/EX-2854)

### [1.0.4](https://bitbucket.org/colbenson/react-wrapper/branches/compare/v1.0.4%0Dv1.0.3) (2020-12-03)

### Bug Fixes

- **children:** fix children unmount fails if parentElement is removed too
  ([3903554](https://bitbucket.org/colbenson/react-wrapper/commits/3903554dc4a770f0f5a47f47d9600a853943e9fc)),
  closes [EX-2732](https://searchbroker.atlassian.net/browse/EX-2732)

### [1.0.3](https://bitbucket.org/colbenson/react-wrapper/branches/compare/v1.0.3%0Dv1.0.2) (2020-11-05)

### Bug Fixes

- **slots:** add support to text content in slots
  ([039ee3f](https://bitbucket.org/colbenson/react-wrapper/commits/039ee3f53f00241d2ea1bb879ba4c047d359c636)),
  closes [EX-2525](https://searchbroker.atlassian.net/browse/EX-2525)

### [1.0.2](https://bitbucket.org/colbenson/react-wrapper/branches/compare/v1.0.2%0Dv1.0.1) (2020-10-29)

### Bug Fixes

- **slots:** check if VueChildrenWrapper is unmounted before unmounting React Component
  ([0841e0d](https://bitbucket.org/colbenson/react-wrapper/commits/0841e0db8843722d784dc9371bf52e2fc63a2e51)),
  closes [EX-2425](https://searchbroker.atlassian.net/browse/EX-2425)

### [1.0.1](https://bitbucket.org/colbenson/react-wrapper/branches/compare/v1.0.1%0Dv1.0.0) (2020-10-19)

### Bug Fixes

- **slots:** avoid creating new HTML elements for slots when the react-wrapper is re-rendered.
  ([24e6142](https://bitbucket.org/colbenson/react-wrapper/commits/24e61426442671a3a8293a140fd93ae81dacd77f)),
  closes [EX-2330](https://searchbroker.atlassian.net/browse/EX-2330)

### Documentation

- add documentation with the usage and architecture
  ([3a0982b](https://bitbucket.org/colbenson/react-wrapper/commits/3a0982b2074eaf1a10a52bf29361d85330c75d79)),
  closes [EX-2390](https://searchbroker.atlassian.net/browse/EX-2390)

## 1.0.0 (2020-07-31)

### Features

- **linter:** use eslint-plugin-x
  ([2d9298b](https://bitbucket.org/colbenson/react-wrapper/commits/2d9298b81d5275e3e17f34a2af0e55a485160875)),
  closes [EX-1946](https://searchbroker.atlassian.net/browse/EX-1946)
- **react-wrapper:** add events support
  ([436481b](https://bitbucket.org/colbenson/react-wrapper/commits/436481be18a27a295767a3ca524ddbf6f26be5e8)),
  closes [EX-1885](https://searchbroker.atlassian.net/browse/EX-1885)
- **react-wrapper:** add slots support
  ([edcfb51](https://bitbucket.org/colbenson/react-wrapper/commits/edcfb51a050a740a716c8573f5ea35dea6bf7259)),
  closes [EX-1791](https://searchbroker.atlassian.net/browse/EX-1791)
- **react-wrapper:** add events support
  ([436481b](https://bitbucket.org/colbenson/react-wrapper/commits/436481be18a27a295767a3ca524ddbf6f26be5e8)),
  closes [EX-1885](https://searchbroker.atlassian.net/browse/EX-1885)
- **react-wrapper:** add slots support
  ([edcfb51](https://bitbucket.org/colbenson/react-wrapper/commits/edcfb51a050a740a716c8573f5ea35dea6bf7259)),
  closes [EX-1791](https://searchbroker.atlassian.net/browse/EX-1791)
- **react-wrapper:** create react-wrapper with props syncing support
  ([ccfe6b2](https://bitbucket.org/colbenson/react-wrapper/commits/ccfe6b20f0d5ef7f0fd0ecd168cee492b8f0a529)),
  closes [EX-1696](https://searchbroker.atlassian.net/browse/EX-1696)

### Code Refactoring

- **linter:** add eslint, prettier and commitizen support
  ([290d103](https://bitbucket.org/colbenson/react-wrapper/commits/290d103d0fad4987a649ae423a2c025532f8b3c2)),
  closes [EX-1885](https://searchbroker.atlassian.net/browse/EX-1885)
- **vue-wrapper:** remove vue-wrapper and its testing
  ([508ea3e](https://bitbucket.org/colbenson/react-wrapper/commits/508ea3ee11864e821b52fdf2858344dc8dd417ff)),
  closes [EX-1885](https://searchbroker.atlassian.net/browse/EX-1885)
- **vue-wrapper:** remove vue-wrapper and its testing
  ([a9d9cc0](https://bitbucket.org/colbenson/react-wrapper/commits/a9d9cc022876550f5f87aa801a5dec9deec7b4fb)),
  closes [EX-1885](https://searchbroker.atlassian.net/browse/EX-1885)
- **linter:** add eslint, prettier and commitizen support
  ([290d103](https://bitbucket.org/colbenson/react-wrapper/commits/290d103d0fad4987a649ae423a2c025532f8b3c2)),
  closes [EX-1885](https://searchbroker.atlassian.net/browse/EX-1885)
