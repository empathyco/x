# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [7.0.0-alpha.4](https://github.com/empathyco/x/compare/@empathyco/x-adapter@7.0.0-alpha.3...@empathyco/x-adapter@7.0.0-alpha.4) (2021-09-22)

**Note:** Version bump only for package @empathyco/x-adapter





## [7.0.0-alpha.3](https://github.com/empathyco/x/compare/@empathyco/x-adapter@7.0.0-alpha.2...@empathyco/x-adapter@7.0.0-alpha.3) (2021-09-15)


### Features

* **search:** save `Redirection`'s entities ([cdba4a6](https://github.com/empathyco/x/commit/cdba4a656f7cea74115d06173151d450657d1aed)), closes [EX-4730](https://searchbroker.atlassian.net/browse/EX-4730)



## [7.0.0-alpha.2](https://github.com/empathyco/x/compare/@empathyco/x-adapter@7.0.0-alpha.1...@empathyco/x-adapter@7.0.0-alpha.2) (2021-09-10)


### Features

* **adapter:** Add new Extra Params interface to all the current Requests interfaces ([9b8f8eb](https://github.com/empathyco/x/commit/9b8f8eb4301f4ddfa547e93d6ef35fbdaffc3200)), closes [EX-4643](https://searchbroker.atlassian.net/browse/EX-4643)
* **search:** add origin to the request ([eb81c7e](https://github.com/empathyco/x/commit/eb81c7e1dacdf0cc201995c9ac5dfe9bb4f64a2d)), closes [EX-4637](https://searchbroker.atlassian.net/browse/EX-4637)



## [7.0.0-alpha.1](https://github.com/empathyco/x/compare/@empathyco/x-adapter@7.0.0-alpha.0...@empathyco/x-adapter@7.0.0-alpha.1) (2021-08-24)


### Features

* **request:** update search request type to include the new extra params ([5dc8bc2](https://github.com/empathyco/x/commit/5dc8bc2c4e3cb397ccc3ae10f64f2bca651336e5)), closes [EX-4634](https://searchbroker.atlassian.net/browse/EX-4634)



## [7.0.0-alpha.0](https://github.com/empathyco/x/compare/@empathyco/x-adapter@6.2.0-alpha.8...@empathyco/x-adapter@7.0.0-alpha.0) (2021-08-11)


### ⚠ BREAKING CHANGES

* **facets-next:** Rename `EmpathyFilterMapper` to `EmpathyFacetFilterMapper`. Response filter mappers now map the API value in the `id` filters property.  `EmpathyHierarchicalFacetMapper` now flattens and stores all the filters in the `filter` property. `EmpathyHierarchicalFacetMapper` now only maps filters ids in `HierarchicalFilter` children. Bump up `@empathyco/x-types` major version in `@empathyco/x-adapter`.

### Features

* **facets-next:** add support for the new search types in search adapter ([aec475e](https://github.com/empathyco/x/commit/aec475e4f689e63a4dc1b0fed3c3ade73b5122f2)), closes [EX-3640](https://searchbroker.atlassian.net/browse/EX-3640)



## [6.2.0-alpha.8](https://github.com/empathyco/x/compare/@empathyco/x-adapter@6.2.0-alpha.7...@empathyco/x-adapter@6.2.0-alpha.8) (2021-08-05)

**Note:** Version bump only for package @empathyco/x-adapter





## [6.2.0-alpha.7](https://github.com/empathyco/x/compare/@empathyco/x-adapter@6.2.0-alpha.6...@empathyco/x-adapter@6.2.0-alpha.7) (2021-08-05)

**Note:** Version bump only for package @empathyco/x-adapter





## [6.2.0-alpha.6](https://github.com/empathyco/x/compare/@empathyco/x-adapter@6.2.0-alpha.5...@empathyco/x-adapter@6.2.0-alpha.6) (2021-08-03)


### Build System

* Update TypeScript to 4.3.5.Update TSLib to 2.3.5. ([4cebdfc](https://github.com/empathyco/x/commit/4cebdfc11e1520552a687def3eda1bf0c132e031)), closes [EX-4435](https://searchbroker.atlassian.net/browse/EX-4435)



## [6.2.0-alpha.5](https://github.com/empathyco/x/compare/@empathyco/x-adapter@6.2.0-alpha.4...@empathyco/x-adapter@6.2.0-alpha.5) (2021-07-29)


### Build System

* use 2 different versions of search-types ([5a6ac76](https://github.com/empathyco/x/commit/5a6ac76fea26c0f284904d4f514a1370b7c6184b)), closes [EX-4477](https://searchbroker.atlassian.net/browse/EX-4477)



## [6.2.0-alpha.4](https://github.com/empathyco/x/compare/@empathyco/x-adapter@6.2.0-alpha.3...@empathyco/x-adapter@6.2.0-alpha.4) (2021-07-28)

**Note:** Version bump only for package @empathyco/x-adapter





## [6.2.0-alpha.3](https://github.com/empathyco/x/compare/@empathyco/x-adapter@6.2.0-alpha.1...@empathyco/x-adapter@6.2.0-alpha.3) (2021-07-27)

**Note:** Version bump only for package @empathyco/x-adapter





## [6.2.0-alpha.2](https://github.com/empathyco/x/compare/@empathyco/x-adapter@6.2.0-alpha.1...@empathyco/x-adapter@6.2.0-alpha.2) (2021-07-20)

**Note:** Version bump only for package @empathyco/x-adapter





## [6.2.0-alpha.1](https://github.com/empathyco/x/compare/@empathyco/x-adapter@6.2.0-alpha.0...@empathyco/x-adapter@6.2.0-alpha.1) (2021-07-20)


### Continuous Integration

* Fix publishing in x-components. Normalize build scripts. (#46) ([c3c2f85](https://github.com/empathyco/x/commit/c3c2f8519c0de1b164074e87e68e77ad1af0d702)), closes [EX-4413](https://searchbroker.atlassian.net/browse/EX-4413)



## 6.2.0-alpha.0 (2021-07-14)


### Features

* prepare `search-adapter` for the mono-repo ([59d1443](https://github.com/empathyco/x/commit/59d14434a663d14384532fe9aeee7e4d93c02675)), closes [EX-3854](https://searchbroker.atlassian.net/browse/EX-3854)
* update `search-adapter` package information (#33) ([a8cdb8d](https://github.com/empathyco/x/commit/a8cdb8d9f9be7f41b40f53e75339df3d1c22bd17)), closes [EX-3935](https://searchbroker.atlassian.net/browse/EX-3935)



## 6.1.0 - 2020/06/03

> EX-3938 Add support for optional `children` property in `HierarchicalFilters`.
>
> EX-3938 Update `@empathy/search-types` to version `9.0.0`.

## 6.0.0 - 2020/04/16

> EX-3070 Add new template config inside the `FacetConfig` model.
>
> EX-3253 Update `@empathy/search-types` to version `8.0.0-alpha.1` and `@empathy/jest-utils` to version `1.3.0`.
>
> EX-3253 Add new facet mapper `EmpathyBooleanFilterMapper` which maps `selected`, `value`, `totalResults` properties removed from `EmpathyFilterMapper`.
>
> EX-3253 Add `EmpathyBooleanFilterMapper` mapper to `DEPENDENCIES.ResponseMappers.simpleFilter`, `DEPENDENCIES.ResponseMappers.hierarchicalFilter`, `DEPENDENCIES.ResponseMappers.numberRangeFilter` dependencies.
>
> EX-3253 Modified `EmpathyRequestFiltersSolrSyntaxMapper` to accept `BooleanFilter` and `EditableNumberRangeFilter`.
>
> EX-3253 Renamed `EmpathyNumberRangeFilter` `value` map to `range`. 
>
> EX-3253 Modified `facets` from `SearchResponse` to make it optional.
> 
> EX-3302 Update `SearchRequest` interface removing the unused `SortDirection` parameter.
>
> EX-3439 Add `EmpathyRequestSortMapper` mapper.

## 5.0.0 - 2020/01/07

> EX-2413 Add new facet mappers `EmpathyFacetMapper`, `EmpathySimpleFacetMapper`, `EmpathyHierarchicalFacetMapper`, and `EmpathyNumberRangeFacetMapper`.
>
> EX-2413 Add new filter mappers `EmpathyFilterMapper`, `EmpathySimpleFilterMapper`, `EmpathyHierarchicalFilterMapper`, and `EmpathyNumberRangeFilterMapper`.
>
> EX-2413 Replace facet mappers in `DEPENDENCIES.ResponseMappers.facets` with the new ones.
>
> EX-2413 Remove `DEPENDENCIES.ResponseMappers.filter` dependency.
>
> EX-2413 Add `DEPENDENCIES.ResponseMappers.simpleFilter`, `DEPENDENCIES.ResponseMappers.hierarchicalFilter`, `DEPENDENCIES.ResponseMappers.numberRangeFilter` with the new filter mappers.
>
> EX-2413 Remove `filterDeepness` and `facetName` from `FilterValueMapperParams` interface. Now the facet name can be got from the `filter` as `facetId` property.
>
> EX-2413 Add `FacetModelName` and `FilterModelName` types.
>
> EX-2413 Replace `filterModelName` prop by `modelName` in the `FacetConfig` interface. Now it has the `FacetModelName` type.

## 4.1.0 2020/09/21

> EX-2185 Allow passing headers through the request
>
> EX-2185 Add `sortDirection` optional parameter to `EmpathySearchRequest` and `SearchRequest`
>
> EX-2152 Add api-extractor and improve build

## 4.0.0 2020/07/30

> EX-1903 Update `@empathy/get-safe-property-chain`, `@empathy/logger`, `@empathy/storage-service`, `@empathybroker/deep-merge` dependencies.
>
> EX-1873 Change StorageService's localStorage access lazy.
>
> EX-1843 Add ESM build
>
> EX-1837 Change next query mapper facets to be an array instead of an object.
>
> EX-1605 Add optional `addConfigChangedListener` and `removeConfigChangedListener` methods to subscribe and unsubscribe to config changes.
>
> EX-1641 Change default search endpoint from `api{env}.empathybroker.com/search/v1/query/{instance}/search` to `api{env}.empathybroker.com/search/v1/query/{instance}/searchX`
>
> EX-1693 Update `@empathy/search-types` to version `5.0.0` and mappers accordingly

## 3.2.2 - 2020/06/18

> EX-1962 Check `rawFilter.value` in `EmpathyRangeFilterMapper` to avoid error

## 3.2.1 - 2020/04/14

> EX-1813 Fix `empathy-facet-mapper` not mapping dynamic filters children property.

## 3.2.0 - 2020/03/09

> EX-1490 Remove warnings about tagging events on production

## 3.1.0 - 2020/02/04

> EX-1506 Add `isWishlisted` field mapping to `mapResult`'s
>
> EX-1376 Externalized in `empathy-search-request.mapper` the logic of appending related tags to the query to a new mapper
>
> EX-1376 Now `empathy-queryable-request.mapper` uses `empathy-request-related-tags-query.mapper` to generate the new query with related tags
>
> EX-1376 Added new request param mapper `empathy-request-related-tags-query.mapper` which concatenates related tags with the query
>
> EX-1376 Now `QueryableRequest` request type allows optionally related tags
>
> EX-1489 Add the `rawResponse` to `beforeResponseTransformed`'s hook context

## 3.0.1

> EX-1540 Update `@empathy/get-safe-property-chain`, `@empathy/logger`, `@empathy/search-types` and `@empathybroker/deep-merge` to use minor version
>
> EX-1540 Set a fixed `@empathybroker/eb-tslint` version

## 3.0.0

> EX-1443 Add new entity `showTagging` used for tracking when te response of a feature has been displayed to the user.
>
> EX-1380 Remove first filter auto-selection from `empathy-suggestion-facets.mapper`
>
> EX-1276 Add `checkout` to `TrackingResultConfig` interface
>
> EX-1355 Removed `preselected` property
>
> EX-1292 Added discovery wall features: `getClicksRecommendations`, `getQueriesRecommendations`, `getSectionRecommendations`, `getUserRecommendations`

## 2.1.0

> EX-1246 Cache API responses with a configurable TTL per feature and invalidation

## 2.0.0

> EX-1240 Remove `needsParentFilter` and `entityDetected` properties

## 1.1.0

> EX-1187 Fixed hierarchical filters not mapping parent selected property correctly
>
> EX-1203 Removed `toLowerCase` transformation from `rawResult.name` in `empathy-result.mapper`
>
> EX-1121 `RecommendationsRequest` now also extends `Partial<QueryableRequest>`
>
> EX-1221 `EmpathyFilterMapper` now maps selected state to ancestors if it is true.
>
> EX-1221 Now the filters selected state only relies on the previous filter selected state, not on the API response.
>
> EX-1221 Set `entityDetected` filters property to false, before removing it in a future PR.

## 1.0.2

> EX-1178 Made raw filters selected property optional

## 1.0.1

> EX-1159 Fixed feature-requestor not mapping falsy values

## 1.0.0

> EX-1017 First search adapter version
