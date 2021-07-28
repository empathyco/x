# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.0-alpha.8](https://github.com/empathyco/x/compare/@empathyco/x-components@3.0.0-alpha.7...@empathyco/x-components@3.0.0-alpha.8) (2021-07-28)


### Bug Fixes

* **promoted:** fix name export of PromotedsList component ([e29bc52](https://github.com/empathyco/x/commit/e29bc52d0c82ba85dc013882e5d80674a870de2f)), closes [EX-4484](https://searchbroker.atlassian.net/browse/EX-4484)



## [3.0.0-alpha.7](https://github.com/empathyco/x/compare/@empathyco/x-components@3.0.0-alpha.5...@empathyco/x-components@3.0.0-alpha.7) (2021-07-27)


### Features

* **search:** add `BannersList` and `PromotedsList` components ([5794f31](https://github.com/empathyco/x/commit/5794f312d21e8b4ec64192ec0533a6f762b39959)), closes [EX-4293](https://searchbroker.atlassian.net/browse/EX-4293)


### Bug Fixes

* **design-system:** Fix padding in Input Group Line variant (#58) ([bea2153](https://github.com/empathyco/x/commit/bea2153b702a37e05cc3240fc6201f5b7f38ed5f)), closes [EX-4459](https://searchbroker.atlassian.net/browse/EX-4459)


### Code Refactoring

* **design-system:** rename `tokens`  to use `style-dictionary` ([1c25fdc](https://github.com/empathyco/x/commit/1c25fdcbe7e13388e465dabd565597acbda32f85)), closes [EX-4327](https://searchbroker.atlassian.net/browse/EX-4327)


### Testing

* **e2e:** stub 'adapter.getTopRecommendations` calls ([93480b4](https://github.com/empathyco/x/commit/93480b4cd14f90b17d85a12debb4a922381b5de7)), closes [EX-3433](https://searchbroker.atlassian.net/browse/EX-3433)



## [3.0.0-alpha.6](https://github.com/empathyco/x/compare/@empathyco/x-components@3.0.0-alpha.5...@empathyco/x-components@3.0.0-alpha.6) (2021-07-20)

**Note:** Version bump only for package @empathyco/x-components





## [3.0.0-alpha.5](https://github.com/empathyco/x/compare/@empathyco/x-components@3.0.0-alpha.4...@empathyco/x-components@3.0.0-alpha.5) (2021-07-20)


### Continuous Integration

* Fix publishing in x-components. Normalize build scripts. (#46) ([c3c2f85](https://github.com/empathyco/x/commit/c3c2f8519c0de1b164074e87e68e77ad1af0d702)), closes [EX-4413](https://searchbroker.atlassian.net/browse/EX-4413)



## [3.0.0-alpha.4](https://github.com/empathyco/x/compare/@empathyco/x-components@3.0.0-alpha.3...@empathyco/x-components@3.0.0-alpha.4) (2021-07-15)


### Testing

* **component:** configure Cypress component testing ([a39172e](https://github.com/empathyco/x/commit/a39172e030f81abf6f9ad1a0cdd5079ec4320e1b)), closes [EX-4339](https://searchbroker.atlassian.net/browse/EX-4339)



## [3.0.0-alpha.3](https://github.com/empathyco/x/compare/@empathyco/x-components@3.0.0-alpha.2...@empathyco/x-components@3.0.0-alpha.3) (2021-07-14)


### Features

* **design-system:** add scroll-to-top slot in Layout ([421e937](https://github.com/empathyco/x/commit/421e9371da6f84069ae033cf0cba8ef360c2603e)), closes [EX-4192](https://searchbroker.atlassian.net/browse/EX-4192)
* **search:** add `Promoted` component ([9c887dc](https://github.com/empathyco/x/commit/9c887dc77e66bf4847a0592557f68461844e0c44)), closes [EX-4289](https://searchbroker.atlassian.net/browse/EX-4289)
* **search:** add Banner component (#42) ([205bf13](https://github.com/empathyco/x/commit/205bf13fe72a5d2c9b28fd0866a9ceb2d14b1700)), closes [EX-4291](https://searchbroker.atlassian.net/browse/EX-4291)


### Bug Fixes

* **components:** make column picker & grid components listen to only `ColumnsNumberProvided` event to fix incorrect columns number on re-mounts ([0d3d366](https://github.com/empathyco/x/commit/0d3d366266cee2e383d442913736d35d2f80ea7c)), closes [EX-4189](https://searchbroker.atlassian.net/browse/EX-4189)
* **directives:** `InfiniteScroll` now works properly in Safari and with html or body as containers ([4921d31](https://github.com/empathyco/x/commit/4921d315b9732f200b1946e2938d20277f04cace)), closes [EX-3826](https://searchbroker.atlassian.net/browse/EX-3826)
* **search:** clean sort value after accept a new query ([0e49049](https://github.com/empathyco/x/commit/0e490499c35ac56705a05c12b05be4f5a86ae8ce)), closes [EX-4188](https://searchbroker.atlassian.net/browse/EX-4188)


### Documentation

* **query-suggestions:** adapt examples to edocs guidelines ([b2380f9](https://github.com/empathyco/x/commit/b2380f95f85d838f0762ea1e608a3ae65ea11b58)), closes [EX-3490](https://searchbroker.atlassian.net/browse/EX-3490)
* **related-tags:** adapt to eDocs guidelines (#35) ([c0cc8ba](https://github.com/empathyco/x/commit/c0cc8ba8a04ca21a206cecd9e657b354e1ece782))


### Testing

* enable e2e test and fix tests (#38) ([9d07a2a](https://github.com/empathyco/x/commit/9d07a2a0d146c5ad9cd5441023b864148759b5b5)), closes [EX-4363](https://searchbroker.atlassian.net/browse/EX-4363)



## [3.0.0-alpha.2](https://bitbucket.org/colbenson/x-components/branches/compare/v3.0.0-alpha.2%0Dv3.0.0-alpha.1) (2021-06-30)


### Features

* **facets:** add `click:show-more` & `click:show-less` events to the `SlicedFilters` component. ([cc1396f](https://bitbucket.org/colbenson/x-components/commits/cc1396fd2e0e07b1e5994ba82cc721aecdfa0bc6)), closes [EX-4284](https://searchbroker.atlassian.net/browse/EX-4284)


### Bug Fixes

* **components:** `StaggeringTransitionGroup` elements now are positioned correctly in scroll containers ([54dbc83](https://bitbucket.org/colbenson/x-components/commits/54dbc83ba764617b4be48c8f7f8272f92e71b924)), closes [EX-4257](https://searchbroker.atlassian.net/browse/EX-4257)

## [3.0.0-alpha.1](https://bitbucket.org/colbenson/x-components/branches/compare/v3.0.0-alpha.1%0Dv3.0.0-alpha.0) (2021-06-30)


### Features

* **components:** Add `@XEmit` decorator ([b4e107a](https://bitbucket.org/colbenson/x-components/commits/b4e107a710ec0312a50366f43b30745c72e69eff)), closes [EX-4245](https://searchbroker.atlassian.net/browse/EX-4245)
* **device:** Add `device` module ([f02cd8b](https://bitbucket.org/colbenson/x-components/commits/f02cd8b47999235f888c883b07504307110ed0c4)), closes [EX-4243](https://searchbroker.atlassian.net/browse/EX-4243)
* **device:** add `DeviceDetector` component ([7b1df85](https://bitbucket.org/colbenson/x-components/commits/7b1df85238ab7ed70e165d499425846e39fbc5de)), closes [EX-4244](https://searchbroker.atlassian.net/browse/EX-4244)
* **x-installer:** make `SnippetConfig` object available for all components ([b7a3f30](https://bitbucket.org/colbenson/x-components/commits/b7a3f3047fa5f72995da0f69ca0624d4a24fed49)), closes [EX-3553](https://searchbroker.atlassian.net/browse/EX-3553)
* **x-plugin:** Remove `XConfig` ([bf54080](https://bitbucket.org/colbenson/x-components/commits/bf54080d18f0c3bc67589d695fde8d9418240d32)), closes [EX-4240](https://searchbroker.atlassian.net/browse/EX-4240)


### Bug Fixes

* **design-system:** solve `Safari` `gap` issues ([c26917a](https://bitbucket.org/colbenson/x-components/commits/c26917a9b38363ea77eee19d26bad61c2a8ae5a8)), closes [EX-3894](https://searchbroker.atlassian.net/browse/EX-3894)


### Testing

* **e2e:** add test for spellcheck component ([456e120](https://bitbucket.org/colbenson/x-components/commits/456e120924377203986d50a58f4b9733aee2be8b)), closes [EX-3963](https://searchbroker.atlassian.net/browse/EX-3963)


### Documentation

* **search-box:** update props and bindings table style and avoid warning block auto-formatting ([ab8716b](https://bitbucket.org/colbenson/x-components/commits/ab8716b1e00e1886a523b3f2acb029ce4d918287)), closes [EX-4231](https://searchbroker.atlassian.net/browse/EX-4231)


### Styling

* format entire project ([8083870](https://bitbucket.org/colbenson/x-components/commits/80838700530436c6e566a89c13a4912fb754f512)), closes [EX-4287](https://searchbroker.atlassian.net/browse/EX-4287)

## [3.0.0-alpha.0](https://bitbucket.org/colbenson/x-components/branches/compare/v3.0.0-alpha.0%0Dv2.1.0-alpha.1) (2021-06-22)


### ⚠ BREAKING CHANGES

* **design-system:** Design system styles have now to be imported from `@empathy/x-components/design-system` instead of `@empathy/x-components/css`

### Features

* **components:** add new `BaseIdPanelToggleButton` and `BaseIdPanelToggle` components ([c10b484](https://bitbucket.org/colbenson/x-components/commits/c10b48487732512edf40565b3abb892ce518c6dd)), closes [EX-4100](https://searchbroker.atlassian.net/browse/EX-4100)


### Testing

* **e2e:** add identifier results tests ([9e93136](https://bitbucket.org/colbenson/x-components/commits/9e93136c61315bc8d4bb7b0d0f61135413d6d7a9)), closes [EX-3961](https://searchbroker.atlassian.net/browse/EX-3961)


### Code Refactoring

* **design-system:** rename `styles` folder to `design-system` ([48b5868](https://bitbucket.org/colbenson/x-components/commits/48b586823afcbe59a5d164c2b0f85fa7bccebab7)), closes [EX-4227](https://searchbroker.atlassian.net/browse/EX-4227)

## [2.1.0-alpha.1](https://bitbucket.org/colbenson/x-components/branches/compare/v2.1.0-alpha.1%0Dv2.1.0-alpha.0) (2021-06-16)


### Features

* **components:** change the render conditions in the `Layout` component ([35645de](https://bitbucket.org/colbenson/x-components/commits/35645de648a0226b6d1a247c3f5353fb5a43cf35)), closes [EX-4171](https://searchbroker.atlassian.net/browse/EX-4171)
* **design-system:** add `x-button--ghost-start` and `x-button--ghost-end` modifiers to `x-button--ghost` variant ([2803dd1](https://bitbucket.org/colbenson/x-components/commits/2803dd1bc7209c07f90dbc4a49d255032b18f5b8)), closes [EX-4179](https://searchbroker.atlassian.net/browse/EX-4179)
* **design-system:** add `x-dropdown` size variants ([d5649ab](https://bitbucket.org/colbenson/x-components/commits/d5649abb8b6a527426cd12a2dea6c950054c42ca)), closes [EX-4098](https://searchbroker.atlassian.net/browse/EX-4098)
* **design-system:** add more values to the `x-list` variants ([5295e2e](https://bitbucket.org/colbenson/x-components/commits/5295e2e0bd2a6db15e13a0bd3b316ae5dcb99616)), closes [EX-4174](https://searchbroker.atlassian.net/browse/EX-4174)
* **design-system:** fix the issue with the `x-tag` and `x-filter` in the selected filters ([bdcbdeb](https://bitbucket.org/colbenson/x-components/commits/bdcbdeb5b351f9fca148afb4ec1a8fdd1d4173e3)), closes [EX-4178](https://searchbroker.atlassian.net/browse/EX-4178)
* **empathize:** add `isOpen` to store state and expose through the Alias API ([590e4db](https://bitbucket.org/colbenson/x-components/commits/590e4db5ef700434bbcf9787825e0ebcfc01b7ff)), closes [EX-4164](https://searchbroker.atlassian.net/browse/EX-4164)
* **facets:** add `isSelected` binding to the `AllFilter` component slot ([2b86731](https://bitbucket.org/colbenson/x-components/commits/2b86731725bb84220b7a0dd7247fe034781442fc)), closes [EX-4173](https://searchbroker.atlassian.net/browse/EX-4173)


### Bug Fixes

* **components:** emit initial default value in the `ColumnPicker` mixin ([d7439b8](https://bitbucket.org/colbenson/x-components/commits/d7439b8317a820a710186870c8a2740b65d45d5b)), closes [EX-4114](https://searchbroker.atlassian.net/browse/EX-4114)
* **design-system:** fix the stroke and the text decoration in the typography ([6bd879d](https://bitbucket.org/colbenson/x-components/commits/6bd879d751ef3c839ad2d466b7887e4048d14157)), closes [EX-4176](https://searchbroker.atlassian.net/browse/EX-4176)
* **facets:** `isNewQuery` utility was returning false when only one query was empty ([b0405e2](https://bitbucket.org/colbenson/x-components/commits/b0405e2eb7effc27f7de9e358ae95e0f3b860d1c)), closes [EX-4160](https://searchbroker.atlassian.net/browse/EX-4160)
* **facets:** new label slot inside the `Hierarchical Filter` children ([7fd1275](https://bitbucket.org/colbenson/x-components/commits/7fd1275fcc52b80d26e08a077091d8e38a14db98)), closes [EX-4172](https://searchbroker.atlassian.net/browse/EX-4172)
* **utils:** add missing exports to barrel ([abc8059](https://bitbucket.org/colbenson/x-components/commits/abc8059bc8ce1c2a7fe7a063a784d74fca789e36)), closes [EX-4182](https://searchbroker.atlassian.net/browse/EX-4182)


### Documentation

* **search-box:** remove values column in props generated table in component doc ([efcb814](https://bitbucket.org/colbenson/x-components/commits/efcb814151bbfcbfb304dd0c4fbf499d501a3e65)), closes [EX-4137](https://searchbroker.atlassian.net/browse/EX-4137)


### Testing

* **e2e:** add partial results tests ([4f09ab4](https://bitbucket.org/colbenson/x-components/commits/4f09ab49bfe232f4d7fdeedf22e67adb7bb9b6f6)), closes [EX-3959](https://searchbroker.atlassian.net/browse/EX-3959)


## [2.1.0-alpha.0](https://bitbucket.org/colbenson/x-components/branches/compare/v2.1.0-alpha.0%0Dv2.0.0-alpha.13) (2021-06-14)


### Features

* **components:** add `AnimateWidth` animation component ([8c7c3e5](https://bitbucket.org/colbenson/x-components/commits/8c7c3e59973d4bed5ff54c673af0b02a69318a34)), closes [EX-4107](https://searchbroker.atlassian.net/browse/EX-4107)
* **design-system:** add `SlidingPanel` default CSS and tokens ([08c7539](https://bitbucket.org/colbenson/x-components/commits/08c7539b18eeacf798a49f146f8e3f67447dedd7)), closes [EX-3864](https://searchbroker.atlassian.net/browse/EX-3864)
* **design-system:** add `x-scroll` component and tokens ([7ba7913](https://bitbucket.org/colbenson/x-components/commits/7ba791318eb0c27011346821b230f5873de37e6f)), closes [EX-4085](https://searchbroker.atlassian.net/browse/EX-4085)
* **design-system:** add Design System classes for the picture image fallback and placeholder ([5503e63](https://bitbucket.org/colbenson/x-components/commits/5503e63e8c96a4fa3b1ba26302e6b3e51a0f9ed8)), closes [EX-4070](https://searchbroker.atlassian.net/browse/EX-4070)
* **design-system:** add Design System icons ([dfe4e51](https://bitbucket.org/colbenson/x-components/commits/dfe4e5188ae5c37463e03a707092fa146ecac127)), closes [EX-3973](https://searchbroker.atlassian.net/browse/EX-3973)
* **design-system:** add Direction Border and Padding List variants ([2efdc21](https://bitbucket.org/colbenson/x-components/commits/2efdc21f97416e9a6f9f1cd6e7bd377ad7893c19)), closes [EX-4064](https://searchbroker.atlassian.net/browse/EX-4064)
* **design-system:** add icons to the Design System view ([b5f86ce](https://bitbucket.org/colbenson/x-components/commits/b5f86cecb39fa9b039317fead3d5461b4ac71357)), closes [EX-4110](https://searchbroker.atlassian.net/browse/EX-4110)
* **design-system:** add Layout component and Design System Layout component ([acc0e2e](https://bitbucket.org/colbenson/x-components/commits/acc0e2eba22af933ec977be615f64702c909f9b3)), closes [EX-3866](https://searchbroker.atlassian.net/browse/EX-3866)
* **design-system:** add list design tokens ([83a024c](https://bitbucket.org/colbenson/x-components/commits/83a024ca2872001382cf5352184150d73d75057c)), closes [EX-3925](https://searchbroker.atlassian.net/browse/EX-3925)
* **design-system:** add new typography variants ([fc934bc](https://bitbucket.org/colbenson/x-components/commits/fc934bc2026d8d161c394f9c51f2eab6b87c0ac5)), closes [EX-4092](https://searchbroker.atlassian.net/browse/EX-4092)
* **design-system:** add option list tokens ([088ad59](https://bitbucket.org/colbenson/x-components/commits/088ad5952a04e22f23639ebe194236db199d0b39)), closes [EX-3860](https://searchbroker.atlassian.net/browse/EX-3860)
* **design-system:** add `x-grid` Design System tokens ([5f198c5](https://bitbucket.org/colbenson/x-components/commits/5f198c587cae04443d28b329f6ff6db883c0073e)), closes [EX-4082](https://searchbroker.atlassian.net/browse/EX-4082)
* **design-system:** add `x-result` Design System tokens ([33c13d7](https://bitbucket.org/colbenson/x-components/commits/33c13d79fa5444c48b1514ddbc77bcb718a303fc)), closes [EX-3765](https://searchbroker.atlassian.net/browse/EX-3765)
* **design-system:** improve `x-icon` token ([088ee0a](https://bitbucket.org/colbenson/x-components/commits/088ee0aa9305306f66297d1c35fc47c856c2d361)), closes [EX-4017](https://searchbroker.atlassian.net/browse/EX-4017)
* **design-system:** add `x-row` and `x-row-item` tokens ([fb58ef1](https://bitbucket.org/colbenson/x-components/commits/fb58ef1d6835cf55bc38226efe30d9cc613680ba)), closes [EX-4000](https://searchbroker.atlassian.net/browse/EX-4000)
* **design-system:** add `x-picture` Design System tokens ([7117399](https://bitbucket.org/colbenson/x-components/commits/71173997a39b2de1b018f4b96485dbfab940c382)), closes [EX-3977](https://searchbroker.atlassian.net/browse/EX-3977)
* **facets:** add `SortedFilters` component ([319106b](https://bitbucket.org/colbenson/x-components/commits/319106b785ea13457c3cdb824ac371160077704d))
* **components:** change `NoElement` component to be not functional ([c4d4590](https://bitbucket.org/colbenson/x-components/commits/c4d45908d27801b0a8c847dbff54a9acd74dfd43)), closes [EX-3997](https://searchbroker.atlassian.net/browse/EX-3997)
* **components:** add `BaseResultPlaceholderImage` and `BaseResultFallbackImage` ([cd246ce](https://bitbucket.org/colbenson/x-components/commits/cd246ce004eb04d5fa5f601fce281c1841fc4e14)), closes [EX-4129](https://searchbroker.atlassian.net/browse/EX-4129)


### Bug Fixes

* **components:** fix `SlidingPanel` buttons were blocking clicks while invisible ([ee9a94a](https://bitbucket.org/colbenson/x-components/commits/ee9a94a227bd942570f689744b3f7c5cd351c342)), closes [EX-4096](https://searchbroker.atlassian.net/browse/EX-4096)
* **facets:** fix issue with hierarchical filters with no children ([0c60915](https://bitbucket.org/colbenson/x-components/commits/0c609153764e3ad39bc3ed3bf7a0e47f92b94120)), closes [EX-4136](https://searchbroker.atlassian.net/browse/EX-4136)
* **search:** fix infinite scroll issues when filtering ([4f08e32](https://bitbucket.org/colbenson/x-components/commits/4f08e32bf9de0f783cae9681733699b6a3c72d3a)), closes [EX-4033](https://searchbroker.atlassian.net/browse/EX-4033)


### Testing

* **e2e:** adapt `empathize` tests to cucumber ([0c86765](https://bitbucket.org/colbenson/x-components/commits/0c8676593ab133f442a0cde8769f73a032096395)), closes [EX-3797](https://searchbroker.atlassian.net/browse/EX-3797)
* **e2e:** update Cypress to 7.4.0 ([9c6db64](https://bitbucket.org/colbenson/x-components/commits/9c6db6455b6f6b61e3b0697e8de32a2d41d2a137)), closes [EX-3991](https://searchbroker.atlassian.net/browse/EX-3991)


### Continuous Integration

* **CI:** update package-lock ([9d0c764](https://bitbucket.org/colbenson/x-components/commits/9d0c764181280135ccae3db16b1171a9cc066818)), closes [EX-4046](https://searchbroker.atlassian.net/browse/EX-4046)


### Build System

* **dependencies:** update `search-adapter` version ([05e5cd7](https://bitbucket.org/colbenson/x-components/commits/05e5cd749c6a9524753e2316928069b7e7605306)), closes [EX-4067](https://searchbroker.atlassian.net/browse/EX-4067)


### Documentation

* **search-box:** update `SearcInput` component documentation ([22f87db](https://bitbucket.org/colbenson/x-components/commits/22f87db5b2143cfde49b17d380c3156cb6610590)), closes [EX-4029](https://searchbroker.atlassian.net/browse/EX-4029)
* **search-box:** update `ClearSearchInput` documentation ([0f01401](https://bitbucket.org/colbenson/x-components/commits/0f0140174878edfbba86ec761e66704b09e72721)), closes [EX-4101](https://searchbroker.atlassian.net/browse/EX-4101)
* **search-box:** update `SearchButton` documentation ([c38f154](https://bitbucket.org/colbenson/x-components/commits/c38f154f4b7293e20004b15096d921bb6107fc0d)), closes [EX-4090](https://searchbroker.atlassian.net/browse/EX-4090)
* **build:** avoid creating Methods section in components documentation ([2383080](https://bitbucket.org/colbenson/x-components/commits/2383080e4b73236f937fde6cdd4eb83b8ae9c5eb)), closes [EX-4028](https://searchbroker.atlassian.net/browse/EX-4028)


### Code Refactoring

* **components:** refactor `CollapseFromTop` animation to use only transformations ([97e6b77](https://bitbucket.org/colbenson/x-components/commits/97e6b772d5776ab9542a23f9d54474a6ca652cff)), closes [EX-4149](https://searchbroker.atlassian.net/browse/EX-4149)

## [2.0.0](https://bitbucket.org/colbenson/x-components/branches/compare/v2.0.0%0Dv2.0.0-alpha.13) (2021-06-03)


### Features

* **design-system:** add `x-sliding-panel` tokens ([08c7539](https://bitbucket.org/colbenson/x-components/commits/08c7539b18eeacf798a49f146f8e3f67447dedd7)), closes [EX-3864](https://searchbroker.atlassian.net/browse/EX-3864)
* **design-system:** add design system icons ([dfe4e51](https://bitbucket.org/colbenson/x-components/commits/dfe4e5188ae5c37463e03a707092fa146ecac127)), closes [EX-3973](https://searchbroker.atlassian.net/browse/EX-3973)
* **design-system:** add `x-list`and variants tokens ([83a024c](https://bitbucket.org/colbenson/x-components/commits/83a024ca2872001382cf5352184150d73d75057c)), closes [EX-3925](https://searchbroker.atlassian.net/browse/EX-3925)
* **design-system:** add `x-option-list` and variants tokens ([088ad59](https://bitbucket.org/colbenson/x-components/commits/088ad5952a04e22f23639ebe194236db199d0b39)), closes [EX-3860](https://searchbroker.atlassian.net/browse/EX-3860)
* **design-system:** add `x-row` and `x-row-item` tokens ([fb58ef1](https://bitbucket.org/colbenson/x-components/commits/fb58ef1d6835cf55bc38226efe30d9cc613680ba)), closes [EX-4000](https://searchbroker.atlassian.net/browse/EX-4000)
* **design-system:** add `x-picture` tokens ([7117399](https://bitbucket.org/colbenson/x-components/commits/71173997a39b2de1b018f4b96485dbfab940c382)), closes [EX-3977](https://searchbroker.atlassian.net/browse/EX-3977)
* **facets:** add `SortedFilters` component ([319106b](https://bitbucket.org/colbenson/x-components/commits/319106b785ea13457c3cdb824ac371160077704d))
* **no-element:** change `NoElement` component to be not functional ([c4d4590](https://bitbucket.org/colbenson/x-components/commits/c4d45908d27801b0a8c847dbff54a9acd74dfd43)), closes [EX-3997](https://searchbroker.atlassian.net/browse/EX-3997)


### Bug Fixes

* **search:** fix infinite scroll issues when filtering ([4f08e32](https://bitbucket.org/colbenson/x-components/commits/4f08e32bf9de0f783cae9681733699b6a3c72d3a)), closes [EX-4033](https://searchbroker.atlassian.net/browse/EX-4033)


### Testing

* **e2e:** adapt `empathize` tests to cucumber ([0c86765](https://bitbucket.org/colbenson/x-components/commits/0c8676593ab133f442a0cde8769f73a032096395)), closes [EX-3797](https://searchbroker.atlassian.net/browse/EX-3797)
* **e2e:** update Cypress to 7.4.0 ([9c6db64](https://bitbucket.org/colbenson/x-components/commits/9c6db6455b6f6b61e3b0697e8de32a2d41d2a137)), closes [EX-3991](https://searchbroker.atlassian.net/browse/EX-3991)


### Build System

* **dependencies:** update `search-adapter` version ([05e5cd7](https://bitbucket.org/colbenson/x-components/commits/05e5cd749c6a9524753e2316928069b7e7605306)), closes [EX-4067](https://searchbroker.atlassian.net/browse/EX-4067)


### Documentation

* **search:** update search input component documentation ([22f87db](https://bitbucket.org/colbenson/x-components/commits/22f87db5b2143cfde49b17d380c3156cb6610590)), closes [EX-4029](https://searchbroker.atlassian.net/browse/EX-4029)
* **components:** avoid creating Methods section in components documentation ([2383080](https://bitbucket.org/colbenson/x-components/commits/2383080e4b73236f937fde6cdd4eb83b8ae9c5eb)), closes [EX-4028](https://searchbroker.atlassian.net/browse/EX-4028)

## [2.0.0-alpha.13](https://bitbucket.org/colbenson/x-components/branches/compare/v2.0.0-alpha.13%0Dv2.0.0-alpha.12) (2021-05-28)


### Features

* **design-system:** add `input-group` variants ([f93e6e8](https://bitbucket.org/colbenson/x-components/commits/f93e6e8424a6673010e5b7eed4d9afb6328803a8)), closes [EX-3707](https://searchbroker.atlassian.net/browse/EX-3707)
* **design-system:** add `justified` variant to `x-filter` component ([41b2d98](https://bitbucket.org/colbenson/x-components/commits/41b2d98e3756955512e4409bc4444963f638c8f0)), closes [EX-3874](https://searchbroker.atlassian.net/browse/EX-3874)
* **design-system:** add `x-button` css class in the necessary elements ([c20e3d9](https://bitbucket.org/colbenson/x-components/commits/c20e3d9eeb0957e90a8ed8dd598d24d1dc63786b)), closes [EX-3703](https://searchbroker.atlassian.net/browse/EX-3703)
* **design-system:** add `x-filter` tokens and CSS ([80f4fef](https://bitbucket.org/colbenson/x-components/commits/80f4fef69aea6f19c9d25ae6c00bbd06ed9d9e6d)), closes [EX-3767](https://searchbroker.atlassian.net/browse/EX-3767)
* **design-system:** add `x-suggestion` design tokens ([9987b2f](https://bitbucket.org/colbenson/x-components/commits/9987b2f3f40423cb9580a3977048092f1d20e6e2)), closes [EX-3715](https://searchbroker.atlassian.net/browse/EX-3715)
* **design-system:** add `x-tag` variants tokens and CSS styles ([c4569e0](https://bitbucket.org/colbenson/x-components/commits/c4569e0e788275d223f45503166081269028f60c)), closes [EX-3916](https://searchbroker.atlassian.net/browse/EX-3916)
* **design-system:** add default `x-facet` tokens and CSS and `x-icon` variants ([ba6b9d3](https://bitbucket.org/colbenson/x-components/commits/ba6b9d3e0a07df70972b69b9224c44aa63111071)), closes [EX-3881](https://searchbroker.atlassian.net/browse/EX-3881)
* **design-system:** add dropdown design tokens ([4e0ffbf](https://bitbucket.org/colbenson/x-components/commits/4e0ffbf8bd9bf95209a26b27bd749243f158a04b)), closes [EX-3769](https://searchbroker.atlassian.net/browse/EX-3769)
* **design-system:** add input default tokens and CSS ([e7a0af1](https://bitbucket.org/colbenson/x-components/commits/e7a0af143b34406e6724a142642773a691d689e6)), closes [EX-3694](https://searchbroker.atlassian.net/browse/EX-3694)
* **design-system:** add input variants tokens and CSS ([88a9844](https://bitbucket.org/colbenson/x-components/commits/88a98444be75dd85f434fe1d99d319b81a06fcbc)), closes [EX-3696](https://searchbroker.atlassian.net/browse/EX-3696)
* **design-system:** add tags default tokens and CSS ([c19055f](https://bitbucket.org/colbenson/x-components/commits/c19055f445d251048abb3edf7e637a4dd5944e0f)), closes [EX-3771](https://searchbroker.atlassian.net/browse/EX-3771)
* **design-system:** add the `.x-input` class to the XComponents where necessary ([e721e78](https://bitbucket.org/colbenson/x-components/commits/e721e7868e3dfae06bc08b70eb2afc407b9dc1e6)), closes [EX-3712](https://searchbroker.atlassian.net/browse/EX-3712)
* **design-system:** add x-facet variants tokens and CSS styles ([36d9843](https://bitbucket.org/colbenson/x-components/commits/36d98439038c794fe13bafdd4d478b4f6edae394)), closes [EX-3914](https://searchbroker.atlassian.net/browse/EX-3914)
* **design-system:** add x-tag css class in the necessary elements ([475a067](https://bitbucket.org/colbenson/x-components/commits/475a0674d8d24c8c64ef1dc072918f5450e1a189)), closes [EX-3912](https://searchbroker.atlassian.net/browse/EX-3912)
* **design-system:** refactor styles folder structure ([4651002](https://bitbucket.org/colbenson/x-components/commits/4651002b14a5ab61b7ab7d096beffa5bf923b65c)), closes [EX-3822](https://searchbroker.atlassian.net/browse/EX-3822)
* **design-system:** add `hierarchical` variant to `x-filter` ([882091c](https://bitbucket.org/colbenson/x-components/commits/882091c2111282eecff98b2d69acafd9c317341f)), closes [EX-3878](https://searchbroker.atlassian.net/browse/EX-3878)
* **facets:** add support for optional hierarchical filter children prop ([df988f3](https://bitbucket.org/colbenson/x-components/commits/df988f33e6206475a4674ceb17f0ffc495139a86))
* **search:** add infinite scroll to `ResultsList` component ([e0a179c](https://bitbucket.org/colbenson/x-components/commits/e0a179c9420573781bfe70a395832e25b706618a)), closes [EX-3788](https://searchbroker.atlassian.net/browse/EX-3788)
* **search:** Add `page` and `pageSize` properties with its mutations. ([a20323f](https://bitbucket.org/colbenson/x-components/commits/a20323f382dac1e70e3d18fd90e231b7d49df005)), closes [EX-3775](https://searchbroker.atlassian.net/browse/EX-3775)
* **search:** update search getter in order to use the new page and pageSize properties of the module ([4b00d36](https://bitbucket.org/colbenson/x-components/commits/4b00d36f463206ef6d956c819704f98a9ac3dd8a)), closes [EX-3787](https://searchbroker.atlassian.net/browse/EX-3787)


### Bug Fixes

* **components:** fix `transform` transition  in `FadeAndSlide` animation component ([bfef3dd](https://bitbucket.org/colbenson/x-components/commits/bfef3ddb946646a1de507e90732d5b07e695e598)), closes [EX-3989](https://searchbroker.atlassian.net/browse/EX-3989)
* **design-tokens:** fix editable tokens not being displayed in view correctly ([f057ab6](https://bitbucket.org/colbenson/x-components/commits/f057ab69cc13d191a93a99692d8cdfe84b87c58a)), closes [EX-3998](https://searchbroker.atlassian.net/browse/EX-3998)


### Build System

* **design-system:** add the Rollup configuration to build the CSS files of the Design System ([cb2642a](https://bitbucket.org/colbenson/x-components/commits/cb2642a398e9f42346a278253fdc46bcddae4c99)), closes [EX-3691](https://searchbroker.atlassian.net/browse/EX-3691)


### Documentation

* **components:** improve the way to show slot bindings data in the components documentation ([eda29ce](https://bitbucket.org/colbenson/x-components/commits/eda29ce581f013bd86ed7b9453d3775a5f42fa18)), closes [EX-3832](https://searchbroker.atlassian.net/browse/EX-3832)


### Testing

* remove old tests ([51ea6a6](https://bitbucket.org/colbenson/x-components/commits/51ea6a64c07726c3c59b9d6f6c1b011853901c43)), closes [EX-3799](https://searchbroker.atlassian.net/browse/EX-3799)

## [2.0.0-alpha.12](https://bitbucket.org/colbenson/x-components/branches/compare/v2.0.0-alpha.12%0Dv2.0.0-alpha.11) (2021-05-06)


### Features

* **components:** add an overlay layer to `BaseModal` component  listening to click events outside the modal to close it ([013b284](https://bitbucket.org/colbenson/x-components/commits/013b2849df1afc89d5646704be562b548a286ac0)), closes [EX-3786](https://searchbroker.atlassian.net/browse/EX-3786)
* **recommendations:** add a scopedSlot `layout` to `Recommendations` component ([d26e0b5](https://bitbucket.org/colbenson/x-components/commits/d26e0b5ccf73691d17377ae1393902ba89dd9803)), closes [EX-3807](https://searchbroker.atlassian.net/browse/EX-3807)


### Bug Fixes

* **components:** fix `FadeAndSlide` and `StaggeredFadeAndSlide` animations ([f0b7014](https://bitbucket.org/colbenson/x-components/commits/f0b701459dbcbdf706d127005df20cbd7c76fb55)), closes [EX-3813](https://searchbroker.atlassian.net/browse/EX-3813)


### Testing

* **e2e:** Add multiselect-filters test ([a7dc169](https://bitbucket.org/colbenson/x-components/commits/a7dc16958e8789d3299bc531362894d58fd7ca0a)), closes [EX-3603](https://searchbroker.atlassian.net/browse/EX-3603)


## [2.0.0-alpha.11](https://bitbucket.org/colbenson/x-components/branches/compare/v2.0.0-alpha.11%0Dv2.0.0-alpha.10) (2021-05-03)


## [2.0.0-alpha.10](https://bitbucket.org/colbenson/x-components/branches/compare/v2.0.0-alpha.10%0Dv2.0.0-alpha.9) (2021-05-03)


### Features

* **contributing-guide:** Add contributing guide ([9f27fc8](https://bitbucket.org/colbenson/x-components/commits/9f27fc8438f4b24c19d6e30de5216e72a38d8ee1)), closes [EX-2891](https://searchbroker.atlassian.net/browse/EX-2891)
* **design-system:** add base tokens ([c124600](https://bitbucket.org/colbenson/x-components/commits/c124600cf491f45d713c37f737ea22d85f004ae4)), closes [EX-3672](https://searchbroker.atlassian.net/browse/EX-3672)
* **design-system:** add Button variations tokens and CSS ([cc20dba](https://bitbucket.org/colbenson/x-components/commits/cc20dba02f29a320e5d1c52b627722fc980d3b29)), closes [EX-3689](https://searchbroker.atlassian.net/browse/EX-3689)
* **design-system:** add default button design tokens and styles ([5d85fcc](https://bitbucket.org/colbenson/x-components/commits/5d85fcc3c83fea25eb41bcde805bb7b3161c031b)), closes [EX-3688](https://searchbroker.atlassian.net/browse/EX-3688)
* **design-system:** add Design System view as showcase ([8493ca4](https://bitbucket.org/colbenson/x-components/commits/8493ca4fb095839603e8efff9318c5adf824ef7f)), closes [EX-3690](https://searchbroker.atlassian.net/browse/EX-3690)
* **directives:** add `InfiniteScroll` directive ([172809d](https://bitbucket.org/colbenson/x-components/commits/172809db62b92783cc0fa28402b21edc2c113b7d)), closes [EX-3352](https://searchbroker.atlassian.net/browse/EX-3352)
* **directives:** add barrel file in `directives` folder and export them in `src` ([8e12202](https://bitbucket.org/colbenson/x-components/commits/8e12202d3173e2cd751321ab8bdac527290012ea)), closes [EX-3779](https://searchbroker.atlassian.net/browse/EX-3779)
* **facets:** add `RenderlessFilter` component ([d30aa57](https://bitbucket.org/colbenson/x-components/commits/d30aa578efddcc1cf7e00d4cca14b9ccf62f007a)), closes [EX-3608](https://searchbroker.atlassian.net/browse/EX-3608)
* **facets:** change `BaseFilter` to `RenderlessFilter` in `HierarchicalFilter` component ([36f2771](https://bitbucket.org/colbenson/x-components/commits/36f2771f78cea144242a5ec66041227efd97993c)), closes [EX-3590](https://searchbroker.atlassian.net/browse/EX-3590)
* **facets:** make `SimpleFilter` component use `RenderlessFilter`, exposing the option of changing the default button. ([ea93d31](https://bitbucket.org/colbenson/x-components/commits/ea93d310e74ec8cdc40361f68428626080810999)), closes [EX-3589](https://searchbroker.atlassian.net/browse/EX-3589)
* **facets:** use the new decorators `inject` and `provide` in the filters components ([876826a](https://bitbucket.org/colbenson/x-components/commits/876826a7ad3b8693569fb5e08a02bef814d17a74)), closes [EX-3465](https://searchbroker.atlassian.net/browse/EX-3465)
* **x-installer:** add option to install asynchronous Vue plugins ([b132dd4](https://bitbucket.org/colbenson/x-components/commits/b132dd43d40954764729f67e87fcbf4b9374f1a4)), closes [EX-3790](https://searchbroker.atlassian.net/browse/EX-3790)


### Bug Fixes

* **tests:** enable new scenario in `querySuggestions` and fix `isInQuerySuggestions` method ([5209bd8](https://bitbucket.org/colbenson/x-components/commits/5209bd82dd0d72351fcacc43c7546e6434aec715)), closes [EX-3307](https://searchbroker.atlassian.net/browse/EX-3307)


### Build System

* **dependencies:** update `search-adapter` and `search-types` versions ([0663e17](https://bitbucket.org/colbenson/x-components/commits/0663e1735393022af9eb57e54de274a224f4416a)), closes [EX-3664](https://searchbroker.atlassian.net/browse/EX-3664)
* **package.json:** update fixed dependencies (package-lock.json) and fix eslint version to minor ([d33ed95](https://bitbucket.org/colbenson/x-components/commits/d33ed958c111e7f3da4f44c6a3073afd915bc02b)), closes [EX-3744](https://searchbroker.atlassian.net/browse/EX-3744)


### Testing

* **e2e:** add different possible combinations for filters-search components ([75b61bb](https://bitbucket.org/colbenson/x-components/commits/75b61bbb8056c3cb08af88244da6518348a8d2e8)), closes [EX-3601](https://searchbroker.atlassian.net/browse/EX-3601)
* **e2e:** add new sort tests ([62c7eee](https://bitbucket.org/colbenson/x-components/commits/62c7eee8652a72e2f3000476188c20d9b3aa9671)), closes [EX-3666](https://searchbroker.atlassian.net/browse/EX-3666)
* **e2e:** e2e test for exclude-filters-with-no-results component ([d36c0b6](https://bitbucket.org/colbenson/x-components/commits/d36c0b6e55b3ce084b2c80d70691fae44446a187)), closes [EX-3599](https://searchbroker.atlassian.net/browse/EX-3599)


### Documentation

* **tests** add tests docs in contributing documentation about factory functions and components wrappers ([fdbe0ac](https://bitbucket.org/colbenson/x-components/commits/fdbe0ac09e30fde2739501211988c351ec975a32)), closes [EX-3760](https://searchbroker.atlassian.net/browse/EX-3760)
* **xcomponents:** add documentation about events emitted by components ([edf3bf6](https://bitbucket.org/colbenson/x-components/commits/edf3bf6d46114e4fc702cb6650f10e6c7f046f99)), closes [EX-3465](https://searchbroker.atlassian.net/browse/EX-3465)


## [2.0.0-alpha.9](https://bitbucket.org/colbenson/x-components/branches/compare/v2.0.0-alpha.9%0Dv2.0.0-alpha.8) (2021-04-13)


### Bug Fixes

* **facets:** Emit the `SelectedFiltersChanged` event when the user deselects the last filter ([cc38322](https://bitbucket.org/colbenson/x-components/commits/cc3832252ae2994a040c268e4c5941c69535382b)), closes [EX-3570](https://searchbroker.atlassian.net/browse/EX-3570)

## [2.0.0-alpha.8](https://bitbucket.org/colbenson/x-components/branches/compare/v2.0.0-alpha.8%0Dv2.0.0-alpha.7) (2021-04-13)


### Bug Fixes

* **facets:** Avoid emitting the `SelectedFiltersChanged` event when facets change for the second time. ([41efe6f](https://bitbucket.org/colbenson/x-components/commits/41efe6f41a6f94427fff455b9a595fe614a4e1a8)), closes [EX-3570](https://searchbroker.atlassian.net/browse/EX-3570)

## [2.0.0-alpha.7](https://bitbucket.org/colbenson/x-components/branches/compare/v2.0.0-alpha.7%0Dv2.0.0-alpha.6) (2021-04-07)


### Features

* **components:** add `BaseColumnPickerList` component ([8eb2322](https://bitbucket.org/colbenson/x-components/commits/8eb232250642a10fe5ef2860a515133ceb3b7003)), closes [EX-3295](https://searchbroker.atlassian.net/browse/EX-3295)
* **components:** add `BaseVariableColumnGrid` component ([9f4ce5a](https://bitbucket.org/colbenson/x-components/commits/9f4ce5a54ce9a383232dd4e537682e7c5b753879)), closes [EX-3297](https://searchbroker.atlassian.net/browse/EX-3297)
* **components:** add `BaseIdScroll` component ([f3366ba](https://bitbucket.org/colbenson/x-components/commits/f3366ba58bd834a4eb65fafdb53821f6391188a2)), closes [EX-3387](https://searchbroker.atlassian.net/browse/EX-3387)
* **components:** add `BaseMainScroll` component ([f4716d1](https://bitbucket.org/colbenson/x-components/commits/f4716d1b613f50f2767ad16fcaa36c70b9b58d29)), closes [EX-3193](https://searchbroker.atlassian.net/browse/EX-3193)
* **decorators:** add `@XProvide` and `@XInject` decorators ([3facc03](https://bitbucket.org/colbenson/x-components/commits/3facc034617dd2270dec2b83b12f15165d324c10)), closes [EX-2893](https://searchbroker.atlassian.net/browse/EX-2893)
* **facets:** add `ExcludeFiltersWithNoResults` component ([eba2bfe](https://bitbucket.org/colbenson/x-components/commits/eba2bfe845a37bcebcb7321de3291ce3fc7eb39c)), closes [EX-3412](https://searchbroker.atlassian.net/browse/EX-3412)
* **facets:** add `EditableNumberRangeFilter` component ([5577f0b](https://bitbucket.org/colbenson/x-components/commits/5577f0b64921ee37605105a89d9edae9660db97c)), closes [EX-3257](https://searchbroker.atlassian.net/browse/EX-3257)
* **facets:** add new events, wiring, and action to keep backend filters selected state ([d84080b](https://bitbucket.org/colbenson/x-components/commits/d84080bdf9452124f405f297a90b59a79a0facc8)), closes [EX-3585](https://searchbroker.atlassian.net/browse/EX-3585)
* **facets:** add the option to init the `frontendFacets` via prop in the `Facets` component ([0e41dc6](https://bitbucket.org/colbenson/x-components/commits/0e41dc633bfa5a388a90ca75f137475f4e042735))
* **facets:** add wiring and store logic in facets module to support `EditableNumberRangeFilter` ([1ad777b](https://bitbucket.org/colbenson/x-components/commits/1ad777b7b87e82845677c232b03dcffad7b3586d)), closes [EX-3258](https://searchbroker.atlassian.net/browse/EX-3258)
* **grid:** add `BaseColumnPickerDropdown` component ([626dfb6](https://bitbucket.org/colbenson/x-components/commits/626dfb645eb614d009c1c5ed185bce0b1d73a758)), closes [EX-3296](https://searchbroker.atlassian.net/browse/EX-3296)
* **history-queries:** modify history-queries to accept a new config and show all the elements in store. ([fb0bdac](https://bitbucket.org/colbenson/x-components/commits/fb0bdacf2bdbf7e0847682dedf7e1a348d8a4b93)), closes [EX-3389](https://searchbroker.atlassian.net/browse/EX-3389)
* **scroll:** add new `BaseScrollToTop` component ([f79207a](https://bitbucket.org/colbenson/x-components/commits/f79207adce6ac348a630ea63ce8279057a24d9a5)), closes [EX-3197](https://searchbroker.atlassian.net/browse/EX-3197)
* **scroll:** add new `BaseScroll` component ([912e198](https://bitbucket.org/colbenson/x-components/commits/912e198bfba15a16400f4bc979f85341649b8814)), closes [EX-3191](https://searchbroker.atlassian.net/browse/EX-3191)
* **search:** add `PartialResultsList` component ([df9eaa1](https://bitbucket.org/colbenson/x-components/commits/df9eaa195f83c32c4208d6b16f2a5768d521a6cc)), closes [EX-3354](https://searchbroker.atlassian.net/browse/EX-3354)
* **search:** add `SortDropdown` component ([c483944](https://bitbucket.org/colbenson/x-components/commits/c483944dca71943f590ec4d2354f6954f2899098)), closes [EX-3299](https://searchbroker.atlassian.net/browse/EX-3299)
* **search:** add new `PartialQueryButton` component ([e99db04](https://bitbucket.org/colbenson/x-components/commits/e99db04190d7f339c26e81613b7942c627789ad1)), closes [EX-3568](https://searchbroker.atlassian.net/browse/EX-3568)
* **search:** add new `SortList` component ([42715f2](https://bitbucket.org/colbenson/x-components/commits/42715f21f9f5ede32696c0b0b7f7da0d380f932a)), closes [EX-3298](https://searchbroker.atlassian.net/browse/EX-3298)
* **search:** add store logic & wiring to support sorting results ([2e7e4a7](https://bitbucket.org/colbenson/x-components/commits/2e7e4a76bc7a450139d99402dba9e2ae799cc63b)), closes [EX-3301](https://searchbroker.atlassian.net/browse/EX-3301)
* **tagging:** add basic tagging x-module ([b60f809](https://bitbucket.org/colbenson/x-components/commits/b60f8092f499c623d0479cf0be4729aaf1d29d77)), closes [EX-3195](https://searchbroker.atlassian.net/browse/EX-3195)
* **x-plugin:** add `initialXModules` to `XPluginOptions` to register `XModules` manually when installing the plugin ([05e17c8](https://bitbucket.org/colbenson/x-components/commits/05e17c8c0f7c49a83f0c0b6cd091391048f48fe7)), closes [EX-3199](https://searchbroker.atlassian.net/browse/EX-3199)


### Code Refactoring

* **animations:** rename animations to fit BEM ([0993d31](https://bitbucket.org/colbenson/x-components/commits/0993d31ac83b4c78273f60a8af903a53251506ac)), closes [EX-3264](https://searchbroker.atlassian.net/browse/EX-3264)
* **decorators:** tidy decorators splitting the bus decorators from the state decorators ([9debc11](https://bitbucket.org/colbenson/x-components/commits/9debc11d3a5143e566932e6072ff7efcb0bf45c7)), closes [EX-3442](https://searchbroker.atlassian.net/browse/EX-3442)
* **facets:** move filter components inside the facets module ([9c266c6](https://bitbucket.org/colbenson/x-components/commits/9c266c60f0efeaef89262eb2d39094ca899100c2)), closes [EX-3270](https://searchbroker.atlassian.net/browse/EX-3270)


### Testing

* **e2e:** fix e2e `SlidingPanel` tests ([0901ddc](https://bitbucket.org/colbenson/x-components/commits/0901ddcf698a74a66231651bb46aebed027f012d)), closes [EX-3438](https://searchbroker.atlassian.net/browse/EX-3438)
* **e2e:** add tests scenarios for sort dropdown and list ([d918d8a](https://bitbucket.org/colbenson/x-components/commits/d918d8a447a57dbbf39974d597ba07f1306c481d)), closes [EX-3201](https://searchbroker.atlassian.net/browse/EX-3201)
* **e2e:** column pickers tests refinement ([74d75d4](https://bitbucket.org/colbenson/x-components/commits/74d75d41ac1224b86de81cce1ae037f77be52453)), closes [EX-3500](https://searchbroker.atlassian.net/browse/EX-3500)
* **e2e:** fix relative imports paths ([1abed82](https://bitbucket.org/colbenson/x-components/commits/1abed829d9de5cecb432b30b319b4250ce472d37)), closes [EX-3434](https://searchbroker.atlassian.net/browse/EX-3434)
* **e2e:** fix setting related tags max items to render in sliding panel view ([ef9f4be](https://bitbucket.org/colbenson/x-components/commits/ef9f4bef7b779114e84759ab626a841d06ddf0d0)), closes [EX-3463](https://searchbroker.atlassian.net/browse/EX-3463)
* **e2e:** add test for `BaseFiltersSearch` ([293ce31](https://bitbucket.org/colbenson/x-components/commits/293ce3146ef8ba043fecdfe7ab67e3083ef1d4f3)), closes [EX-3232](https://searchbroker.atlassian.net/browse/EX-3232)
* **e2e:** add test for `BaseColumnPickerList` and dropdown ([cd128d1](https://bitbucket.org/colbenson/x-components/commits/cd128d174926cca2fb86fc58dc92b99a00746be1)), closes [EX-3219](https://searchbroker.atlassian.net/browse/EX-3219)
* **e2e:** add tests for `SlidingPanel` component ([414c679](https://bitbucket.org/colbenson/x-components/commits/414c679c5d48f6a2e3bbd01aac90ce81209c16cb)), closes [EX-3238](https://searchbroker.atlassian.net/browse/EX-3238)

## [2.0.0-alpha.6](https://bitbucket.org/colbenson/x-components/branches/compare/v2.0.0-alpha.6%0Dv2.0.0-alpha.5) (2021-03-16)


### ⚠ BREAKING CHANGES

* **facets:** Filters which have selected property now extends from BooleanFilter

### Features

* **facets:** update search-types and search-adapter to allow EditableNumberRangeFilters ([691ab64](https://bitbucket.org/colbenson/x-components/commits/691ab64054740eb1a50a9cfba72be8e4a306e24b)), closes [EX-3367](https://searchbroker.atlassian.net/browse/EX-3367)
* **search:** add `ResultsList` component ([6ee52aa](https://bitbucket.org/colbenson/x-components/commits/6ee52aae52defcba3598bf76174ccb6469038439)), closes [EX-3172](https://searchbroker.atlassian.net/browse/EX-3172)
* **search:** add `Spellcheck` component ([62432cc](https://bitbucket.org/colbenson/x-components/commits/62432cc82a547326159bcb216fb1f734914ae86e)), closes [EX-3179](https://searchbroker.atlassian.net/browse/EX-3179)
* **search:** add `SpellcheckButton` component ([13446ed](https://bitbucket.org/colbenson/x-components/commits/13446eddbf1e3dea8bb3220283f17134e23cc608)), closes [EX-3329](https://searchbroker.atlassian.net/browse/EX-3329)
* **search:** add `totalResults` property to the search module state and to the alias API ([0e51507](https://bitbucket.org/colbenson/x-components/commits/0e5150710f0be3882a72a991375b0a419956ee20)), closes [EX-3187](https://searchbroker.atlassian.net/browse/EX-3187)

### Bug Fixes

* **components:** `EventsModalOpen`, `IdModalOpen` components can now contain HTML elements inside. Disable page scroll when modals are open. Close modals when either clicked out of them or focus is lost ([3284e49](https://bitbucket.org/colbenson/x-components/commits/3284e49c521d3fab1fa971f3d378a32f6dbe6a30)), closes [EX-3361](https://searchbroker.atlassian.net/browse/EX-3361)

### Testing

* **e2e:** add tests for `BaseKeyboardNavigation` component ([ea3d71d](https://bitbucket.org/colbenson/x-components/commits/ea3d71d0b40b7346a8d5a45bb12294f26dadc62f)), closes [EX-3240](https://searchbroker.atlassian.net/browse/EX-3240)
* **e2e:** add tests for `BaseResultImage` component ([639ed31](https://bitbucket.org/colbenson/x-components/commits/639ed314715c9e31e0461d8d297ade30ad769603)), closes [EX-3234](https://searchbroker.atlassian.net/browse/EX-3234)

### Build System

* **dependencies:** update [@vue-cli](https://bitbucket.org/vue-cli) dependencies to 4.5.x ([b05dd01](https://bitbucket.org/colbenson/x-components/commits/b05dd01519111a35ae04431c3c5de2d226b04b80)), closes [EX-3335](https://searchbroker.atlassian.net/browse/EX-3335)


### Code Refactoring

* add `scoped` attribute to `<style>` to components that were missing it ([4f2c8d6](https://bitbucket.org/colbenson/x-components/commits/4f2c8d60be7e9631867afd45e73420a4a3238e32)), closes [EX-3266](https://searchbroker.atlassian.net/browse/EX-3266)

## [2.0.0-alpha.5](https://bitbucket.org/colbenson/x-components/branches/compare/v2.0.0-alpha.5%0Dv2.0.0-alpha.4) (2021-03-08)


### Build System

* fix publish directory ([4f08381](https://bitbucket.org/colbenson/x-components/commits/4f08381a16d0fd8052f7ea062e300047377c4a6e))

## [2.0.0-alpha.4](https://bitbucket.org/colbenson/x-components/branches/compare/v2.0.0-alpha.4%0Dv2.0.0-alpha.3) (2021-03-08)


### Features

* **animations:** added z-index within staggered animations styles ([3be7086](https://bitbucket.org/colbenson/x-components/commits/3be708666287c46d69b892b040e4024d8a28e16b)), closes [EX-3082](https://searchbroker.atlassian.net/browse/EX-3082)
* **base-components:** add `base-id-modal`, `base-id-modal-open` and `base-id-moda-close` components ([abde27f](https://bitbucket.org/colbenson/x-components/commits/abde27fc109f11a0147913fb3893c5c536c34829)), closes [EX-3100](https://searchbroker.atlassian.net/browse/EX-3100)
* **base-grid:** add base-grid component ([acae2b0](https://bitbucket.org/colbenson/x-components/commits/acae2b0f157f69c22b62758e50f9f032c59fb901)), closes [EX-3245](https://searchbroker.atlassian.net/browse/EX-3245)
* **components:** add `BaseDropdown` component. ([6009ad4](https://bitbucket.org/colbenson/x-components/commits/6009ad41e3233c7053fccdba625484405291d676))
* **components:** add mixing `CollapseWidth` component export ([d393120](https://bitbucket.org/colbenson/x-components/commits/d39312016f8894d90b871763ed1eb6d7c3a3d86a)), closes [EX-2994](https://searchbroker.atlassian.net/browse/EX-2994)
* **facets:** add new filter to deselect the filters if the query has changed ([89ca130](https://bitbucket.org/colbenson/x-components/commits/89ca13066e0fe48f413a529e42d7431f50751534)), closes [EX-3101](https://searchbroker.atlassian.net/browse/EX-3101)
* **facets:** facets split in backend and frontend facets ([5d8a60f](https://bitbucket.org/colbenson/x-components/commits/5d8a60f26faaab9af72147c411cb040d8503b0ce)), closes [EX-3255](https://searchbroker.atlassian.net/browse/EX-3255)
* **filters:** renders a selected filters from state and exposes slots to customize it ([3a6ed89](https://bitbucket.org/colbenson/x-components/commits/3a6ed892072dbe98ce3ebb37b45707a477f33690)), closes [EX-2863](https://searchbroker.atlassian.net/browse/EX-2863)
* **search:** remove search results getter and replace the access to them with the State decorator ([6c31810](https://bitbucket.org/colbenson/x-components/commits/6c31810a110ca7cd17c82ae0fac1d85826a36ae6)), closes [EX-3053](https://searchbroker.atlassian.net/browse/EX-3053)
* **search-module:** Add banners an promoteds in store. ([07dc7d6](https://bitbucket.org/colbenson/x-components/commits/07dc7d62aff50cd897bf4ae6a19155164e67e919)), closes [EX-3175](https://searchbroker.atlassian.net/browse/EX-3175)


### Bug Fixes

* **history-queries:** replace last query, if the last word of it is refined in the new query ([8f0f6e4](https://bitbucket.org/colbenson/x-components/commits/8f0f6e4be7a58269a690845049e10a2e7a949c9f)), closes [EX-3084](https://searchbroker.atlassian.net/browse/EX-3084)


### Performance Improvements

* **e2e:** avoid opening new browser instances to speed up e2e tests ([958139d](https://bitbucket.org/colbenson/x-components/commits/958139d0d466133f61e4d6738ab2cbcc2638422f)), closes [EX-3160](https://searchbroker.atlassian.net/browse/EX-3160)


### Code Refactoring

* **e2e:** homogenise and standardise common-steps and test cases ([28b08ce](https://bitbucket.org/colbenson/x-components/commits/28b08ceedba1ba9aeac8440cd67a7da36e16ffe7)), closes [EX-3060](https://searchbroker.atlassian.net/browse/EX-3060)
* **x-plugin:** extract `XComponentAliasAPI` logic to a separate file and improve aliases generation ([e846edd](https://bitbucket.org/colbenson/x-components/commits/e846edda6222b91efbcb4c74ce926f62b8d24f85)), closes [EX-3189](https://searchbroker.atlassian.net/browse/EX-3189) [EX-3189](https://searchbroker.atlassian.net/browse/EX-3189) [EX-3288](https://searchbroker.atlassian.net/browse/EX-3288) [feature/EX-3189](https://searchbroker.atlassian.net/browse/EX-3189)


### Testing

* **e2e:** add next-queries e2e tests ([ae56046](https://bitbucket.org/colbenson/x-components/commits/ae56046674a71abda14bb7138566bc2b1a2a8bf3)), closes [EX-3047](https://searchbroker.atlassian.net/browse/EX-3047)
* **e2e:** add test for base event modal ([0121ddb](https://bitbucket.org/colbenson/x-components/commits/0121ddb9e3d390541afc1398c81fae9fa04afde7)), closes [EX-3228](https://searchbroker.atlassian.net/browse/EX-3228)
* **e2e:** related tags e2e tests ([688f0aa](https://bitbucket.org/colbenson/x-components/commits/688f0aa3f398d901432db69144784db69cf96d3d)), closes [EX-3155](https://searchbroker.atlassian.net/browse/EX-3155)


### Build System

* improve process deleting the temporally directories ([712af79](https://bitbucket.org/colbenson/x-components/commits/712af794649d75722a5533b107fc9c97ebb6f5ae)), closes [EX-2124](https://searchbroker.atlassian.net/browse/EX-2124)

## [2.0.0-alpha.3](https://bitbucket.org/colbenson/x-components/branches/compare/v2.0.0-alpha.3%0Dv2.0.0-alpha.2) (2021-02-12)


### ⚠ BREAKING CHANGES

* **currency-formatter:** remove `CurrencyOptions` from `XConfig` and its default value from `DEFAULT_X_CONFIG`,
remove `ConfigCurrencyChanged` event from `XEventsTypes` and remove `currency` property from `SnippetConfig`.
* **exports:** Rename some wires due to collisions between other exported members (i.e. actions/getters):
`facets` ->  `setFacets` to `setFacetsWire`, `toggleSimpleFilter` to `toggleSimpleFilterWire`, `toggleHierarchicalFilter` to `toggleHierarchicalFilterWire`, `toggleNumberRangerFilter` to `toggleNumberRangerFilterWire`, `clearFacetsSelectedFilters` to `clearFacetsSelectedFiltersWire`, `clearFacetSelectedFilters` to `clearFacetSelectedFiltersWire` and `clearSelectedFilters` to `clearSelectedFiltersWire`.
`history-queries` -> `loadHistoryQueriesFromBrowserStorage` to `loadHistoryQueriesFromBrowserStorageWire`.
`next-queries` -> `fetchAndSaveNextQueries` to `fetchAndSaveNextQueriesWire` and `setQueryFromLastHistoryQuery` to `setQueryFromLastHistoryQueryWire`.
`query-suggestions` -> `fetchAndSaveSuggestions` to `fetchAndSaveSuggestionsWire` and `cancelFetchAndSaveSuggestions` to `cancelFetchAndSaveSuggestionsWire`.
`related-tags` -> `fetchAndSaveRelatedTags` to `fetchAndSaveRelatedTagsWire`, `cancelFetchAndSaveRelatedTags` to `cancelFetchAndSaveRelatedTagsWire` and `toggleRelatedTag` to `toggleRelatedTagWire`.
`search` ->  `fetchAndSaveSearchResponse` to `fetchAndSaveSearchResponseWire` and `cancelFetchAndSaveSearchResponse` to `cancelFetchAndSaveSearchResponseWire`.

Rename exports of `getters` named `request` to `moduleName` + `Request` due to collisions between modules.
Rename `ClearFilters` class to `ClearSelectedFilters`.

### Features

* **e2e test for recommendations components:** e2e test for recommendations component ([e6729b9](https://bitbucket.org/colbenson/x-components/commits/e6729b9744a8c681b560a48acdb166211f632ed4)), closes [EX-3003](https://searchbroker.atlassian.net/browse/EX-3003)
* **e2e testing for query-suggestions component:** e2e testing for query-suggestions component ([01cbeb2](https://bitbucket.org/colbenson/x-components/commits/01cbeb2cb0329954225cc7eaa3fd3581a3258b7b)), closes [EX-2912](https://searchbroker.atlassian.net/browse/EX-2912)
* **facets:** add an option to set the state facets via prop ([8f08f97](https://bitbucket.org/colbenson/x-components/commits/8f08f97ae1ccf7d2f65c34b51bcaa95b3a162d59)), closes [EX-2870](https://searchbroker.atlassian.net/browse/EX-2870)
* **facets:** add renderableFacets prop to Facets component to filter rendered facets ([66cfdf3](https://bitbucket.org/colbenson/x-components/commits/66cfdf328d17c8fe0711241c9ee74a2d04e7cf83)), closes [EX-3037](https://searchbroker.atlassian.net/browse/EX-3037)
* **facets:** support receiving facets containing selected filters in `Facets.vue` ([25a7579](https://bitbucket.org/colbenson/x-components/commits/25a7579ba5a71035c654caafab366a1910f2beac)), closes [EX-3092](https://searchbroker.atlassian.net/browse/EX-3092)
* **related tags:** added related tags config to set a maximum number of items to render ([c173b91](https://bitbucket.org/colbenson/x-components/commits/c173b91d282b0a108ee62310ba806a2560f09838)), closes [EX-3031](https://searchbroker.atlassian.net/browse/EX-3031)


### Styling

* **getters:** rename getters name adding .getter at the end ([c5a5fbe](https://bitbucket.org/colbenson/x-components/commits/c5a5fbec1f0deb4b593e193667ca06ca93730691)), closes [EX-3036](https://searchbroker.atlassian.net/browse/EX-3036)


### Code Refactoring

* **currency-formatter:** extract currency format logic from `base-currency.vue` to a `currency-formatter` utility ([6c35819](https://bitbucket.org/colbenson/x-components/commits/6c35819978ec27771ee7ea2591862b6b6fe8f15b)), closes [EX-2919](https://searchbroker.atlassian.net/browse/EX-2919)
* **exports:** add missing actions and getters exports ([bb8e715](https://bitbucket.org/colbenson/x-components/commits/bb8e715aaf2e0f99dfebe0354d5bee689a208607)), closes [EX-2687](https://searchbroker.atlassian.net/browse/EX-2687)


### Testing

* **default-tests:** Disabled some of old E2E tests ([acc8774](https://bitbucket.org/colbenson/x-components/commits/acc8774011407808ca83017ee08fc9fa8d0be629)), closes [EX-3088](https://searchbroker.atlassian.net/browse/EX-3088)
* **history queries:** e2e test history queries ([392ecfe](https://bitbucket.org/colbenson/x-components/commits/392ecfe721e70e5ceabdf72a53c9c76ec3695f78)), closes [EX-2958](https://searchbroker.atlassian.net/browse/EX-2958)

## [2.0.0-alpha.2](https://bitbucket.org/colbenson/x-components/branches/compare/v2.0.0-alpha.2%0Dv2.0.0-alpha.1) (2021-01-20)


### Bug Fixes

* **facets:** add missing `SelectedFilters` component export ([4c9a32c](https://bitbucket.org/colbenson/x-components/commits/4c9a32c52de66bb388a0259f7fb6436db65f1d26)), closes [EX-2984](https://searchbroker.atlassian.net/browse/EX-2984)

## [2.0.0-alpha.1](https://bitbucket.org/colbenson/x-components/branches/compare/v2.0.0-alpha.1%0Dv2.0.0-alpha.0) (2021-01-19)


### ⚠ BREAKING CHANGES

* **base-components:** `BaseModalContainer` has been split into 2 new components: `BaseEventsModal`, which acts like the old component, but with the `eventToEmitOnClose` prop renamed to `bodyClickEvent`. `BaseModal` now acts as a dumb modal that receives its open state via props.
`BaseCloseButton` has been renamed to `BaseEventsCloseButton`
`BaseOpenButton` has been renamed to `BaseEventsOpenButton`
Events have been renamed: `UserOpenedX` -> `UserClickedOpenX`, `UserClosedX` -> `UserClickedCloseX`

### Features

* **animations:** add `CollapseWidth` animation ([c4b0e0c](https://bitbucket.org/colbenson/x-components/commits/c4b0e0c572717caf599d4605d25460c0131a6856)), closes [EX-2826](https://searchbroker.atlassian.net/browse/EX-2826)
* **base-components:** add `BaseRating` component ([ceb0c54](https://bitbucket.org/colbenson/x-components/commits/ceb0c54860f405025b965cea759929bae94ee308)), closes [EX-2871](https://searchbroker.atlassian.net/browse/EX-2871)
* **base-components:** add `BaseRatingFilterLabel` component ([1b2fd35](https://bitbucket.org/colbenson/x-components/commits/1b2fd354ba82bf5597727c5ee85af1068396b0f8)), closes [EX-2832](https://searchbroker.atlassian.net/browse/EX-2832)
* **base-components:** add `BaseModal` and `BaseEventsModal` components ([5539447](https://bitbucket.org/colbenson/x-components/commits/55394478446bb8bd5de3dc7ac27c5f584b0518a2)), closes [EX-2830](https://searchbroker.atlassian.net/browse/EX-2830)
* **base-components:** add `BasePriceFilterLabel` component ([0feba8f](https://bitbucket.org/colbenson/x-components/commits/0feba8f6b26581eef934367e35bbeb8ede530a8e)), closes [EX-2759](https://searchbroker.atlassian.net/browse/EX-2759)
* **facets:** add `selectedFilters` binding for each slot and facet in `Facets` component ([1e4c473](https://bitbucket.org/colbenson/x-components/commits/1e4c47326fadc09681b07fbb4b8262fe76c78c64)), closes [EX-2887](https://searchbroker.atlassian.net/browse/EX-2887)
* **facets:** add `clearSelectedFilters` wire in `UserAcceptedAQuery` event ([5167766](https://bitbucket.org/colbenson/x-components/commits/516776610df3ae001e60402dedf7619331a1116d)), closes [EX-2927](https://searchbroker.atlassian.net/browse/EX-2927)
* **facets:** add `SelectedFilters` component which renders the selected filters ([a48e436](https://bitbucket.org/colbenson/x-components/commits/a48e436559318bfecbc1ab3f50f90c8079ace2de)), closes [EX-2855](https://searchbroker.atlassian.net/browse/EX-2855)


### Bug Fixes

* **plugin:** fix types to allow overriding parts of the store ([677cb1b](https://bitbucket.org/colbenson/x-components/commits/677cb1ba50ff61816175adbf6fe26ecd9a7a4b21)), closes [EX-2803](https://searchbroker.atlassian.net/browse/EX-2803)


### Code Refactoring

* **animations:** extract mixin from `CollapseHeight` and `CollapseWidth` animations ([31e217b](https://bitbucket.org/colbenson/x-components/commits/31e217bcbb7e3f7a8a254e9888161d13c919ead4)), closes [EX-2827](https://searchbroker.atlassian.net/browse/EX-2827)
* **components/filters:** reorganize components/filters directory ([44d99fb](https://bitbucket.org/colbenson/x-components/commits/44d99fb90aa04e6c7b23d4d6fb10553d510a5a5b)), closes [EX-2911](https://searchbroker.atlassian.net/browse/EX-2911)


### Testing

* **e2e:** implement search-box test scenarios ([726cec3](https://bitbucket.org/colbenson/x-components/commits/726cec3e527ee14ee2c93320ed44dc763475e827)), closes [EX-2725](https://searchbroker.atlassian.net/browse/EX-2725)
* **e2e:** update cypress version ([1f627f2](https://bitbucket.org/colbenson/x-components/commits/1f627f21ba776550de7a5ad627830ce1a7f6737a)), closes [EX-2917](https://searchbroker.atlassian.net/browse/EX-2917)
* **e2e:** refine search-box tests ([7e26220](https://bitbucket.org/colbenson/x-components/commits/7e26220b829acc8a5ac9dfe5a3d40d6e64b7f467)), closes [EX-2962](https://searchbroker.atlassian.net/browse/EX-2962)

## [2.0.0-alpha.0](https://bitbucket.org/colbenson/x-components/branches/compare/v2.0.0-alpha.0%0Dv1.1.2) (2020-12-29)


### ⚠ BREAKING CHANGES

* rename actions in several modules: Popular searches `getSuggestions` → `fetchSuggestions`.
Query suggestions: `getAndSaveSuggestions` → `fetchAndSaveSuggestions`,  `getSuggestions` → `fetchSuggestions`.

### Features

* **actions:** generalize request actions ([b4be6a2](https://bitbucket.org/colbenson/x-components/commits/b4be6a282f8b89982e7dd3e39d7fc3d1f09839b1)), closes [EX-2663](https://searchbroker.atlassian.net/browse/EX-2663)
* **actions:** use `cancellable-promise` in every request action ([d369491](https://bitbucket.org/colbenson/x-components/commits/d36949151ad8e7b7bdcde63afd57e49b34b1bc60)), closes [EX-2664](https://searchbroker.atlassian.net/browse/EX-2664)
* **animations:** add `CollapseHeight` component ([cd5f9d1](https://bitbucket.org/colbenson/x-components/commits/cd5f9d1ae1cc1a9a503f4c2070e5f9b1dc73b3c0)), closes [EX-2661](https://searchbroker.atlassian.net/browse/EX-2661)
* **base-components:** add `BaseFilters` component ([4889c6b](https://bitbucket.org/colbenson/x-components/commits/4889c6b4ed455a53d52b70a9bfca755cc5654c30)), closes [EX-2513](https://searchbroker.atlassian.net/browse/EX-2513)
* **base-components:** add `BaseNumberRangeFilter` component ([dd0fbff](https://bitbucket.org/colbenson/x-components/commits/dd0fbff07af6fea81a5e1f57ecf0bf398948c3db)), closes [EX-2797](https://searchbroker.atlassian.net/browse/EX-2797)
* **base-components:** add `BaseCurrency` component ([1fd6a3f](https://bitbucket.org/colbenson/x-components/commits/1fd6a3faaeb88906f11893b20c3d7e19bd65f8d5)), closes [EX-2758](https://searchbroker.atlassian.net/browse/EX-2758)
* **base-components:** add `BaseFiltersSearch` component ([cf5dbbf](https://bitbucket.org/colbenson/x-components/commits/cf5dbbf2308f89c1efc5bdbe7bb4c80f957876b9)), closes [EX-2234](https://searchbroker.atlassian.net/browse/EX-2234)
* **base-components:** add `BaseHeaderTogglePanel` component ([73b7c69](https://bitbucket.org/colbenson/x-components/commits/73b7c690cc9cdb64b8ea8dde03ccba6c5c51e6e9)), closes [EX-2232](https://searchbroker.atlassian.net/browse/EX-2232)
* **base-components:** add `BaseSlicedFilters` component ([0e8f1cc](https://bitbucket.org/colbenson/x-components/commits/0e8f1cc813c8b49769afe1cbb7eebb9cecc0a338)), closes [EX-2721](https://searchbroker.atlassian.net/browse/EX-2721)
* **base-components:** add `BaseHierarchicalFilter` component ([946f3e6](https://bitbucket.org/colbenson/x-components/commits/946f3e6e186bf61a1c03b5aa3f455bf5f5975125))
* **base-components:** add `BaseTogglePanel` component ([922040c](https://bitbucket.org/colbenson/x-components/commits/922040c05b44dc23bc8854bc8b853153ba70e462)), closes [EX-2658](https://searchbroker.atlassian.net/browse/EX-2658)
* **facets:** add `ClearAll` selected filters component ([63356f7](https://bitbucket.org/colbenson/x-components/commits/63356f76d6ba499f9855564f14e792dcb2aa0873)), closes [EX-2560](https://searchbroker.atlassian.net/browse/EX-2560)
* **eslint:** update `@empathy/eslint-plugin-x` to `1.2.1` and fix some files ([6bfbede](https://bitbucket.org/colbenson/x-components/commits/6bfbedec033516e0e3c7b14fb863f4f8af990412)), closes [EX-2779](https://searchbroker.atlassian.net/browse/EX-2779)
* **facets:** add `MultiSelectFilters` component. ([b660f58](https://bitbucket.org/colbenson/x-components/commits/b660f5820f1f7e80514c9d3ca3ae94a64bfb1788)), closes [EX-2580](https://searchbroker.atlassian.net/browse/EX-2580)
* **facets:** add `SelectedFiltersChanged` emitter ([b4df7ab](https://bitbucket.org/colbenson/x-components/commits/b4df7ab622d62f6e83d3d0f2fc6cc0d7f9d7f541))
* **facets:** add `toggleSimpleFilter` action ([e47ce20](https://bitbucket.org/colbenson/x-components/commits/e47ce2032d31646c4c83f54f94bf3b017aaf05df)), closes [EX-2458](https://searchbroker.atlassian.net/browse/EX-2458)
* **facets:** all filter button which deselects its filters ([67ebc9c](https://bitbucket.org/colbenson/x-components/commits/67ebc9c81ec457fbf1625f7c1d1125ea97eb8a22)), closes [EX-2701](https://searchbroker.atlassian.net/browse/EX-2701)
* **facets:** add `toggleHierarchicalFilter` action ([7e59555](https://bitbucket.org/colbenson/x-components/commits/7e59555680a4d8de6173f1a95401173d8ebeb0da)), closes [EX-2459](https://searchbroker.atlassian.net/browse/EX-2459)
* **facets:** add new events for clear filters ([9c5fdc3](https://bitbucket.org/colbenson/x-components/commits/9c5fdc3f8f6fb4d5f873a3e6b67ef4670bfa77e2)), closes [EX-2561](https://searchbroker.atlassian.net/browse/EX-2561)
* **facets:** extract `BaseFilter` component from `BaseHierarchicalFilter` and `BaseSimpleFilter` components ([021922b](https://bitbucket.org/colbenson/x-components/commits/021922b528178af8a88431087324a5642b83ed77)), closes [EX-2603](https://searchbroker.atlassian.net/browse/EX-2603)
* **facets:** add `Facets` component ([64cd22c](https://bitbucket.org/colbenson/x-components/commits/64cd22c75ff9b0c41f3dbf55433645352cbb6b73)), closes [EX-2417](https://searchbroker.atlassian.net/browse/EX-2417)
* **facets:** keep selection state of the current filters ([8a0ee37](https://bitbucket.org/colbenson/x-components/commits/8a0ee37906852241beda2084c0f877ea09415d41)), closes [EX-2654](https://searchbroker.atlassian.net/browse/EX-2654)
* **facets:** update facets module with new search-types ([1d1abaf](https://bitbucket.org/colbenson/x-components/commits/1d1abaf8e832bf5b9bcf408cf68e4d254a6eee13)), closes [EX-2509](https://searchbroker.atlassian.net/browse/EX-2509)
* **facets:** add `filtersMap` getter and `selectedFilters` getter refactor ([fc03a1c](https://bitbucket.org/colbenson/x-components/commits/fc03a1c87c53d06726bf644b6cc10354e4e24ba4))
* **search:** add `SelectedFiltersChanged` wiring ([fdc6379](https://bitbucket.org/colbenson/x-components/commits/fdc63795a2d1e3ed470b017ff14631f0c81169e2))
* **store:** add `status` to every store module ([4ac4a34](https://bitbucket.org/colbenson/x-components/commits/4ac4a34993a97b351f560159c2e1a0c19b47bc39)), closes [EX-2435](https://searchbroker.atlassian.net/browse/EX-2435)
* **utils:** add callback for cancellable promises ([102634f](https://bitbucket.org/colbenson/x-components/commits/102634f3f6c6061f0c51d3508d043932fea382d6)), closes [EX-2380](https://searchbroker.atlassian.net/browse/EX-2380)


### Bug Fixes

* **base-components:** make `BaseTogglePanel` component render a `div` to solve react-wrapper integration issues. ([27454c6](https://bitbucket.org/colbenson/x-components/commits/27454c6b7229592bec6fc30dcaaf608888d993ad)), closes [EX-2763](https://searchbroker.atlassian.net/browse/EX-2763)
* **index.html:** added link to polyfill.io to load polyfills necessary for running the project in IE ([736631e](https://bitbucket.org/colbenson/x-components/commits/736631ef8e90cc11fd86d2b32b88fd228b83689a)), closes [EX-2707](https://searchbroker.atlassian.net/browse/EX-2707)
* **jenkinsfile:** Updated Docker image version ([230f319](https://bitbucket.org/colbenson/x-components/commits/230f3191664a188374e5ecedcefc9158fa17807e))
* **runbooks-integration:** fix the bug on the sidebar paths doesn't match the real paths ([7ade8ea](https://bitbucket.org/colbenson/x-components/commits/7ade8eaa4fe400b9f08a2b895cfd9e9d27444ef3))
* **search-input:** fix debounced query not cancelled on clear query issue ([33362a8](https://bitbucket.org/colbenson/x-components/commits/33362a81609436bdda8e96a7b45b4b773c796973)), closes [EX-2709](https://searchbroker.atlassian.net/browse/EX-2709)


### Documentation

* **docusaurus:** automated sidebar generation & docusaurus markdown headers. ([69fc29d](https://bitbucket.org/colbenson/x-components/commits/69fc29d39515c52a34f08d45aaba5a53ae8817de)), closes [EX-2207](https://searchbroker.atlassian.net/browse/EX-2207)


### Testing

* **e2e:** fix Keyboard Navigation & Base Modal Container e2e tests ([a31b023](https://bitbucket.org/colbenson/x-components/commits/a31b0230bd058ca3d128d57b69ef2076d98f396f)), closes [EX-2708](https://searchbroker.atlassian.net/browse/EX-2708)
* **e2e:** fix some e2e tests adding checks as guards ([ebf1493](https://bitbucket.org/colbenson/x-components/commits/ebf1493f8d67c3e237ede208785f4c775c223274)), closes [EX-2243](https://searchbroker.atlassian.net/browse/EX-2243)


### Styling

* **base-components:** reformat `BaseFilter` code and add style for selected filters ([9c57b20](https://bitbucket.org/colbenson/x-components/commits/9c57b20e7c06133b34b5ba97365c6d884cd3469c)), closes [EX-2712](https://searchbroker.atlassian.net/browse/EX-2712)


### Code Refactoring

* **base-components:** rename from figure to picture ([1ec8621](https://bitbucket.org/colbenson/x-components/commits/1ec8621d8c85c3830bedd67c49ac4bf4e64ae34b)), closes [EX-2713](https://searchbroker.atlassian.net/browse/EX-2713)
* **base-components:** added default content to some simple components and default style ([0459913](https://bitbucket.org/colbenson/x-components/commits/04599139a80af43ae668bb96313683da4aff29fb)), closes [EX-2714](https://searchbroker.atlassian.net/browse/EX-2714)

### [1.1.2](https://bitbucket.org/colbenson/x-components/branches/compare/v1.1.2%0Dv1.1.1) (2020-12-03)


### Bug Fixes

* **build:** replace style injector with ES5 version ([ec89099](https://bitbucket.org/colbenson/x-components/commits/ec890990cdd3c3edfaf6631cfa0fe8b84163e580)), closes [EX-2752](https://searchbroker.atlassian.net/browse/EX-2752)

### [1.1.1](https://bitbucket.org/colbenson/x-components/branches/compare/v1.1.1%0Dv1.1.0) (2020-12-03)


### Bug Fixes

* **build:** output es5 code for Vue components ([40eab09](https://bitbucket.org/colbenson/x-components/commits/40eab0978f297760c729eeb1ecab475aeeef0d7b)), closes [EX-2734](https://searchbroker.atlassian.net/browse/EX-2734)

## [1.1.0](https://bitbucket.org/colbenson/x-components/branches/compare/v1.1.0%0Dv1.0.0) (2020-10-20)


### Features

* **animations:** add staggering-transition-group component ([b8218b3](https://bitbucket.org/colbenson/x-components/commits/b8218b39392487af2194f7b38f20f027e9b8876a)), closes [EX-2208](https://searchbroker.atlassian.net/browse/EX-2208)
* **api-extractor:** refactor api-extractor doc generation ([0feabc8](https://bitbucket.org/colbenson/x-components/commits/0feabc8252cf9aafb410b6fb218d19647a0c471e)), closes [EX-2152](https://searchbroker.atlassian.net/browse/EX-2152)
* **build:** add rollup polyfills wrapper plugin ([e02747d](https://bitbucket.org/colbenson/x-components/commits/e02747d4a8c53965402c8a7b71c0e1545afa98d1)), closes [EX-2051](https://searchbroker.atlassian.net/browse/EX-2051)
* **cancellable-promise:** add cancellable-promise utility ([b6f0615](https://bitbucket.org/colbenson/x-components/commits/b6f06156448aa67a60885d3527ced076062e15f8)), closes [EX-2244](https://searchbroker.atlassian.net/browse/EX-2244)
* **empathize:** keep Empathize open when focus inside ([fb8e04f](https://bitbucket.org/colbenson/x-components/commits/fb8e04f2acb1eec7694905ccafbf0d7ed38be350)), closes [EX-2123](https://searchbroker.atlassian.net/browse/EX-2123)
* **eslint:** update eslint-plugin-x to 1.2.0 version which includes 2.1.2 prettier version ([f976e09](https://bitbucket.org/colbenson/x-components/commits/f976e0926d82b6185d6f02a793e961fb738182aa)), closes [EX-2238](https://searchbroker.atlassian.net/browse/EX-2238)
* **facets-empty-module:** create empty module for facets ([8c9a7d7](https://bitbucket.org/colbenson/x-components/commits/8c9a7d7a61af4da9f1da46ff17a38a52dac8e126)), closes [EX-2221](https://searchbroker.atlassian.net/browse/EX-2221)
* **facets-module:** create wire which emits a commit to set the facets in the state ([35be528](https://bitbucket.org/colbenson/x-components/commits/35be5280fb43b57ef438e4aff215dd93ec2f964e)), closes [EX-2222](https://searchbroker.atlassian.net/browse/EX-2222)
* **getters-query-suggestions:** create getters for query suggestions to use property hideIfEqualsQuery ([63a1ac3](https://bitbucket.org/colbenson/x-components/commits/63a1ac3326df108ca21f38827bd09796ed96bc22)), closes [EX-2296](https://searchbroker.atlassian.net/browse/EX-2296)
* **popular-searches:** add hide popular searches that have already been searched in session ([ea97456](https://bitbucket.org/colbenson/x-components/commits/ea974562002c665be2e3345ee35dd77c2398e8d5)), closes [EX-2128](https://searchbroker.atlassian.net/browse/EX-2128)
* **search:** add basic search x-module ([2ce6544](https://bitbucket.org/colbenson/x-components/commits/2ce65445fb4dd0c746c96b446058a8694b97242b)), closes [EX-2167](https://searchbroker.atlassian.net/browse/EX-2167)
* **search-input:** add property autofocus ([844da3b](https://bitbucket.org/colbenson/x-components/commits/844da3be4167de23f2cffe60e59ee9bb557d28e5)), closes [EX-2129](https://searchbroker.atlassian.net/browse/EX-2129)
* **sliding-panel:** add SlidingPanel component ([fc1bb76](https://bitbucket.org/colbenson/x-components/commits/fc1bb76e5984407aa49005d86ee5b1283e64540d)), closes [EX-2201](https://searchbroker.atlassian.net/browse/EX-2201)
* **x-installer:** add XInstaller utility ([dce8bf1](https://bitbucket.org/colbenson/x-components/commits/dce8bf19ada65633ad7d5a34c2431ee8ce81ad67)), closes [EX-2136](https://searchbroker.atlassian.net/browse/EX-2136)


### Bug Fixes

* **clean-search-input:** add emitter for the `UserClearedQuery` event. Allow `UserIsTypingAQuery` to be always emitted. ([f02913c](https://bitbucket.org/colbenson/x-components/commits/f02913cd0c6d98194da041f762dcd9a55fb3bd4d)), closes [EX-2031](https://searchbroker.atlassian.net/browse/EX-2031)
* **history-queries:** fixed toggle related tag action to clean the previous related tags ([8c1a9e9](https://bitbucket.org/colbenson/x-components/commits/8c1a9e97dbd20042f67a7a909b8fe61ea36d4a5f)), closes [EX-2213](https://searchbroker.atlassian.net/browse/EX-2213)
* **identifier-results:** fix the request action to save the results if the query is empty ([fad5019](https://bitbucket.org/colbenson/x-components/commits/fad50198066071c9915393d313c6c7f8f08700c9)), closes [EX-2200](https://searchbroker.atlassian.net/browse/EX-2200)


### Documentation

* **build:** document how to debug the build process ([1a713bc](https://bitbucket.org/colbenson/x-components/commits/1a713bc869e0542c9ab90c4b29ba2f02de487d06)), closes [EX-2189](https://searchbroker.atlassian.net/browse/EX-2189)
* **xcomponents:** move xcomponents documentation to independent file. Added a header to each file ([218efd0](https://bitbucket.org/colbenson/x-components/commits/218efd06f281dd7341dd69d330cc8059e5f16038)), closes [EX-2081](https://searchbroker.atlassian.net/browse/EX-2081)


### Testing

* **e2e:** create multiple test environment templates ([833c177](https://bitbucket.org/colbenson/x-components/commits/833c1772ff0186ce1cab2d5303c01d5768745fcb)), closes [EX-1863](https://searchbroker.atlassian.net/browse/EX-1863)
* **e2e:** define basic use cases ([c9c837c](https://bitbucket.org/colbenson/x-components/commits/c9c837ce35f2e3d3792a3e9dfebcca63c2e50092)), closes [EX-2110](https://searchbroker.atlassian.net/browse/EX-2110)
* **result-image:** e2e tests for the component ([faf475a](https://bitbucket.org/colbenson/x-components/commits/faf475a40c6f4210f3483972072d648204272f17)), closes [EX-1978](https://searchbroker.atlassian.net/browse/EX-1978)

## [1.0.0](https://bitbucket.org/colbenson/x-components/commits/tag/v1.0.0) (2020-07-30)


### Features

* **base-suggestions:** add index to slot bindings for suggestions ([9e0c327](https://bitbucket.org/colbenson/x-components/commits/9e0c3271a7152b3ce4d8198db83f165628119d09)), closes [EX-1966](https://searchbroker.atlassian.net/browse/EX-1966)
* **config:** refactor XPluginOptions and XModule configurations ([ed4e140](https://bitbucket.org/colbenson/x-components/commits/ed4e140696f217bc636d587c36206ca2b1fef598)), closes [EX-1994](https://searchbroker.atlassian.net/browse/EX-1994)
* **decorator:** add support for multiple and dynamic events to XOn decorator ([924b9f7](https://bitbucket.org/colbenson/x-components/commits/924b9f7c2a57585a2a8063e40edb65a709f39afe)), closes [EX-1977](https://searchbroker.atlassian.net/browse/EX-1977)
* **decorators:** add filtering support to XOn decorator ([5f63f1b](https://bitbucket.org/colbenson/x-components/commits/5f63f1b71cc981ce4d9786fc4b4424aa282b3f76)), closes [EX-1874](https://searchbroker.atlassian.net/browse/EX-1874)
* **emitters:** add `isDifferent` optional option to emitters for checking if the observed value has really changed ([94e5b27](https://bitbucket.org/colbenson/x-components/commits/94e5b27341e8a99059ccf2dd8d2a4aabadb8164a)), closes [EX-1990](https://searchbroker.atlassian.net/browse/EX-1990)
* **empathize:** add empathize component ([0449433](https://bitbucket.org/colbenson/x-components/commits/044943390998517419cfaa5e49eae61c24000262)), closes [EX-1894](https://searchbroker.atlassian.net/browse/EX-1894)
* **getters-proxy:** add cache to the getters proxy ([ea9d091](https://bitbucket.org/colbenson/x-components/commits/ea9d091acc717c9c4562e3be88e719c0eef75930)), closes [EX-2070](https://searchbroker.atlassian.net/browse/EX-2070)
* **identifier-results:** add IdentifierResult component ([d9273dd](https://bitbucket.org/colbenson/x-components/commits/d9273ddab781bc48be49fee108ccbb2bf1740328)), closes [EX-1958](https://searchbroker.atlassian.net/browse/EX-1958)
* **identifier-results:** add mutations and actions to the module ([f6fd746](https://bitbucket.org/colbenson/x-components/commits/f6fd7467ffc25cd71de1ea88d211a7b14297659e)), closes [EX-1942](https://searchbroker.atlassian.net/browse/EX-1942)
* **identifier-results:** create identifier results module with getters ([d5159f4](https://bitbucket.org/colbenson/x-components/commits/d5159f49790ac4af28dc58fb079732434e615a25)), closes [EX-1942](https://searchbroker.atlassian.net/browse/EX-1942)
* **identifier-results:** identifierResults component and module wiring ([d56ca97](https://bitbucket.org/colbenson/x-components/commits/d56ca97fea0996b496526e067339c5c5b3540ef1)), closes [EX-1957](https://searchbroker.atlassian.net/browse/EX-1957)
* **linter:** add x eslint plugin ([f6ef7f3](https://bitbucket.org/colbenson/x-components/commits/f6ef7f370aaf8f5be1136780c1b0d33163ba6407)), closes [EX-1946](https://searchbroker.atlassian.net/browse/EX-1946)
* **next-queries:** add maxItemsToRender prop ([b420edf](https://bitbucket.org/colbenson/x-components/commits/b420edf0a0e6df05e3a2f110221a8245fcdaac52)), closes [EX-2030](https://searchbroker.atlassian.net/browse/EX-2030)
* **wiring:** add option to pass a function with the store as payload for the wireDispatch factory methods. ([c7611a9](https://bitbucket.org/colbenson/x-components/commits/c7611a927917dd0e9b3b1ae3c3549e2c5aa6d478)), closes [EX-2002](https://searchbroker.atlassian.net/browse/EX-2002)
* **wiring:** refactor namespaced wiring ([ec51b88](https://bitbucket.org/colbenson/x-components/commits/ec51b8885b200fdae26040bd228c5fb80d8db5b6)), closes [EX-1888](https://searchbroker.atlassian.net/browse/EX-1888)
* **wiring:** refactor namespaced wiring ([1cf09f9](https://bitbucket.org/colbenson/x-components/commits/1cf09f947f0760fabf950db784fde21962229e5a)), closes [EX-1888](https://searchbroker.atlassian.net/browse/EX-1888)
* **x-plugin:** add alias API ([c1f5b5a](https://bitbucket.org/colbenson/x-components/commits/c1f5b5a9d3579eb26bfb6293bce538eff9dd4dd2)), closes [EX-1920](https://searchbroker.atlassian.net/browse/EX-1920)
* **currency-filter:** add currency filter and formatter ([9cf9f9e](https://bitbucket.org/colbenson/x-components/commits/9cf9f9e4a754e20698d616923e073afa7d41950d)), closes [EX-1913](https://searchbroker.atlassian.net/browse/EX-1913)
* **base-result-previous-price:** add base result previous price component ([a51df82](https://bitbucket.org/colbenson/x-components/commits/a51df8225c268513fe95e7e8ef505934f72d6c3d)), closes [EX-1913](https://searchbroker.atlassian.net/browse/EX-1913)
* **related-tags:** add e2e testing for the related tags ([98c80e3](https://bitbucket.org/colbenson/x-components/commits/98c80e305a5e39e6f47c7104a099a944cc70bc35)), closes [EX-1968](https://searchbroker.atlassian.net/browse/EX-1968)
* **spatial-navigation:** ability to move between any component and the keyboard-navigation component ([0d80db8](https://bitbucket.org/colbenson/x-components/commits/0d80db89f65d3eb1ef34979fe8ff98f4d83f389a)), closes [EX-1924](https://searchbroker.atlassian.net/browse/EX-1924)
* **animations:** fade and slide animation component ([5ac5a0e](https://bitbucket.org/colbenson/x-components/commits/5ac5a0e94896550c6e9b8b6f0eacefd35e60b565)), closes [EX-1867](https://searchbroker.atlassian.net/browse/EX-1867)
* **base-modal-container:** add base-modal-container component ([cd5d22b](https://bitbucket.org/colbenson/x-components/commits/cd5d22b36d5d2c76eb98adf83cb3ac69de9edc44)), closes [EX-1765](https://searchbroker.atlassian.net/browse/EX-1765)
* **base-result-current-price:** create base result current price component ([6684fd3](https://bitbucket.org/colbenson/x-components/commits/6684fd3c53905345a842dd58546549cf55be9e0a)), closes [EX-1913](https://searchbroker.atlassian.net/browse/EX-1913)
* **base-result-image:** add the base result image with lazy loading also fallback and placeholder ([d19ead6](https://bitbucket.org/colbenson/x-components/commits/d19ead60777d8faebbc30c38ec0982e4134a8478))
* **base-result-link:** refactor BaseResultLink component to receive origin and events by injection ([8233b1b](https://bitbucket.org/colbenson/x-components/commits/8233b1b388a4e94d98f5d3c75253a31558a3ff5e)), closes [EX-1971](https://searchbroker.atlassian.net/browse/EX-1971)
* **base-suggestion:** allow string in matching part to retain accent marks ([94c4ddf](https://bitbucket.org/colbenson/x-components/commits/94c4ddf3d186527462794a2af39a96c93200c885)), closes [EX-1886](https://searchbroker.atlassian.net/browse/EX-1886)
* **bus:** make metadata parameter optional ([9d61ce4](https://bitbucket.org/colbenson/x-components/commits/9d61ce436d8e9abc52a780b84ff2d7e9985a753b)), closes [EX-1695](https://searchbroker.atlassian.net/browse/EX-1695)
* **clear-search-input:** add clear-search-input button ([0b5ec3b](https://bitbucket.org/colbenson/x-components/commits/0b5ec3b52ff4ed6d1f46398639d08a5b7e32f6ae)), closes [EX-1663](https://searchbroker.atlassian.net/browse/EX-1663)
* **close-button:** add close-button component ([b0a07dc](https://bitbucket.org/colbenson/x-components/commits/b0a07dc5c3f989b2ad5519efc32a8a13434a7076)), closes [EX-1765](https://searchbroker.atlassian.net/browse/EX-1765)
* **compile-message:** add compileMessage filter and register it globally ([8fe4710](https://bitbucket.org/colbenson/x-components/commits/8fe471063f92eed9d90667c1970eed28bd62598b)), closes [EX-1779](https://searchbroker.atlassian.net/browse/EX-1779)
* **conventional-commits:** add conventional-commits and commitizen npm packages ([e3bdcd4](https://bitbucket.org/colbenson/x-components/commits/e3bdcd413f990b5934fafd0190bb8ef5820f18ff)), closes [EX-1614](https://searchbroker.atlassian.net/browse/EX-1614)
* **cypress:** add @cypress/webpack-preprocessor to support TypeScript ([52aa5ad](https://bitbucket.org/colbenson/x-components/commits/52aa5adc3c7166ea063a136193b43591dd0ce516)), closes [EX-1790](https://searchbroker.atlassian.net/browse/EX-1790)
* **cypress:** add custom command for cypress ([c988994](https://bitbucket.org/colbenson/x-components/commits/c988994a7e773a1762c7e6134c7e9efcfd344e5a)), closes [EX-1792](https://searchbroker.atlassian.net/browse/EX-1792)
* **cypress:** disable video recording in Cypress e2e tests ([cf9beeb](https://bitbucket.org/colbenson/x-components/commits/cf9beebea12f25ef8ea49380de6705984f1c9c4f)), closes [EX-1866](https://searchbroker.atlassian.net/browse/EX-1866)
* **cypress:** inject XComponents to the global window object when Cypress is running ([4591cd2](https://bitbucket.org/colbenson/x-components/commits/4591cd20773838a777af1af0f83a64f49b2894d9)), closes [EX-1768](https://searchbroker.atlassian.net/browse/EX-1768)
* **docs:** docusaurus integration ([80af715](https://bitbucket.org/colbenson/x-components/commits/80af715744a01868f1b9df198b8545e3f9b397e3)), closes [EX-1869](https://searchbroker.atlassian.net/browse/EX-1869)
* **empathize:** create empty Empathize module ([74441d1](https://bitbucket.org/colbenson/x-components/commits/74441d1dec34e2298df6e6a2ddfa3e2e3cc6be19)), closes [EX-1804](https://searchbroker.atlassian.net/browse/EX-1804)
* **empathize:** keyboardNavigation component which deals with arrow keys pressed inside it ([3191215](https://bitbucket.org/colbenson/x-components/commits/31912159bbc860e3c622c4d9561e1afcff3bcff9)), closes [EX-1804](https://searchbroker.atlassian.net/browse/EX-1804)
* **eslint:** configure ESLint by subfolder and cypress rules ([734717e](https://bitbucket.org/colbenson/x-components/commits/734717e1058b10481ec237413fc3c5a44361b870)), closes [EX-1675](https://searchbroker.atlassian.net/browse/EX-1675)
* **event-button:** add metadata target property to emitted events ([812a678](https://bitbucket.org/colbenson/x-components/commits/812a678ca479006dd1d534ad2c9b4a0b6ce425c1)), closes [EX-1663](https://searchbroker.atlassian.net/browse/EX-1663)
* **event-metadata:** add metadata parameter ([d2128e8](https://bitbucket.org/colbenson/x-components/commits/d2128e8ab1aae7a3e75f387835f0dec7fb63a6b2)), closes [EX-1617](https://searchbroker.atlassian.net/browse/EX-1617)
* **eventbutton:** add EventButton reusable component ([3c29f32](https://bitbucket.org/colbenson/x-components/commits/3c29f32ae4aea62bc3d6a37b9a224f57af10c2df)), closes [EX-1680](https://searchbroker.atlassian.net/browse/EX-1680)
* **global-config:** add global configuration XConfig ([4f0bc33](https://bitbucket.org/colbenson/x-components/commits/4f0bc33ee698041979de4fc64afc55f3e245551b)), closes [EX-1604](https://searchbroker.atlassian.net/browse/EX-1604)
* **history-queries:** add actions ([e2192a1](https://bitbucket.org/colbenson/x-components/commits/e2192a1de8cc0f1c6743ec1bf585ffdca6dace24)), closes [EX-1764](https://searchbroker.atlassian.net/browse/EX-1764)
* **history-queries:** add ClearHistoryQueries Component ([6bf6da6](https://bitbucket.org/colbenson/x-components/commits/6bf6da64cd41e1570cf3d0ee7cbdb3a3e1bf2d58)), closes [EX-1763](https://searchbroker.atlassian.net/browse/EX-1763)
* **history-queries:** add delete-history-query component ([c442b1a](https://bitbucket.org/colbenson/x-components/commits/c442b1aff0e6a929ebe2dc159a5b320f683c4503)), closes [EX-1778](https://searchbroker.atlassian.net/browse/EX-1778)
* **history-queries:** add DeleteHistoryQuery component ([80e060e](https://bitbucket.org/colbenson/x-components/commits/80e060e851b1a9801e021cb6cb1ddd39e7b5578b)), closes [EX-1778](https://searchbroker.atlassian.net/browse/EX-1778)
* **history-queries:** add history queries emitters ([2d30d86](https://bitbucket.org/colbenson/x-components/commits/2d30d868f35264cacb6838862a4cc32afc00f945)), closes [EX-1738](https://searchbroker.atlassian.net/browse/EX-1738)
* **history-queries:** add history queries getters ([9a7fea4](https://bitbucket.org/colbenson/x-components/commits/9a7fea440f0f3b1c90222f28a35e5638c6a07b5e)), closes [EX-1735](https://searchbroker.atlassian.net/browse/EX-1735)
* **history-queries:** add history queries module wiring. ([3337b54](https://bitbucket.org/colbenson/x-components/commits/3337b548bcc5710aa7f77192690f8d1defa41367)), closes [EX-1738](https://searchbroker.atlassian.net/browse/EX-1738)
* **history-queries:** add history queries store for its x-module ([463aab1](https://bitbucket.org/colbenson/x-components/commits/463aab1209704aec64f3f164813621e68e194033)), closes [EX-1764](https://searchbroker.atlassian.net/browse/EX-1764)
* **history-queries:** add history queries x-module skeleton ([2217dc1](https://bitbucket.org/colbenson/x-components/commits/2217dc1ab5e5fb80ccca15ba1e1c247ca19a4c28)), closes [EX-1735](https://searchbroker.atlassian.net/browse/EX-1735)
* **history-queries:** add history-queries module to app & its e2e testing ([e3a61ec](https://bitbucket.org/colbenson/x-components/commits/e3a61ec0bf068db7ee540d03d8bc056c468b3a92)), closes [EX-1762](https://searchbroker.atlassian.net/browse/EX-1762)
* **history-queries:** add HistoryQueries component ([99bfc13](https://bitbucket.org/colbenson/x-components/commits/99bfc13047c56e6e11d6f308fff4f0c79c6c33a2)), closes [EX-1739](https://searchbroker.atlassian.net/browse/EX-1739)
* **history-queries:** add load history queries action ([66c8a97](https://bitbucket.org/colbenson/x-components/commits/66c8a97c9e8e34b0b108ecd898564a87207bd540)), closes [EX-1764](https://searchbroker.atlassian.net/browse/EX-1764)
* **history-queries:** add module events ([ea577b4](https://bitbucket.org/colbenson/x-components/commits/ea577b44548b57c02d32749bc498a1ed0216742d)), closes [EX-1736](https://searchbroker.atlassian.net/browse/EX-1736)
* **history-queries:** trim query before storing it ([c8ccee0](https://bitbucket.org/colbenson/x-components/commits/c8ccee0b8b05854832e688032c81fd5a08748caf)), closes [EX-1764](https://searchbroker.atlassian.net/browse/EX-1764)
* **immediate-store-emitters:** add immediate option for store emitters configuration ([dd35599](https://bitbucket.org/colbenson/x-components/commits/dd355993443131f06801cdbb1267d788c5bc3474)), closes [EX-1642](https://searchbroker.atlassian.net/browse/EX-1642)
* **keyboard-navigation:** add SpatialNavigation service to use in keyboard navigation component ([c42fa13](https://bitbucket.org/colbenson/x-components/commits/c42fa13dd51a9458063ed81d90a0b49d6d3a295c)), closes [EX-1924](https://searchbroker.atlassian.net/browse/EX-1924)
* **next-queries:** add config for the next queries module ([220b72e](https://bitbucket.org/colbenson/x-components/commits/220b72e424b25313f7fe1847b178d40edd7f549b)), closes [EX-1731](https://searchbroker.atlassian.net/browse/EX-1731)
* **next-queries:** add events types for the next queries module ([0336ac7](https://bitbucket.org/colbenson/x-components/commits/0336ac71dc6427a83b1b46ec60e46e869f53d119)), closes [EX-1730](https://searchbroker.atlassian.net/browse/EX-1730)
* **next-queries:** add Next Queries Component ([1ac7f3a](https://bitbucket.org/colbenson/x-components/commits/1ac7f3a3867bf700ec0595f227529fd98cec8ca8)), closes [EX-1734](https://searchbroker.atlassian.net/browse/EX-1734)
* **next-queries:** add next-queries x-module ([1f40a88](https://bitbucket.org/colbenson/x-components/commits/1f40a88fb39ac738109cb2c73eb762eb64c604fb)), closes [EX-1627](https://searchbroker.atlassian.net/browse/EX-1627)
* **next-queries:** add NextQueriesChanged emitter to next queries emitters ([efc68d0](https://bitbucket.org/colbenson/x-components/commits/efc68d07de1c88989296f9596a0514be87f0eabb)), closes [EX-1732](https://searchbroker.atlassian.net/browse/EX-1732)
* **next-queries:** add NextQueriesChanged emitter to next queries emitters ([8a0f0ce](https://bitbucket.org/colbenson/x-components/commits/8a0f0ce4700a49eccdb016e99ad2abe4902c4a75)), closes [EX-1732](https://searchbroker.atlassian.net/browse/EX-1732)
* **next-queries:** add the NextQuery component ([45ea468](https://bitbucket.org/colbenson/x-components/commits/45ea4680d9f6265e91e050dae2913002db989cff)), closes [EX-1733](https://searchbroker.atlassian.net/browse/EX-1733)
* **no-suggestions:** append no-suggestions component ([709a82b](https://bitbucket.org/colbenson/x-components/commits/709a82b5fa7225853e62cf16846ea784a549d26f)), closes [EX-1741](https://searchbroker.atlassian.net/browse/EX-1741)
* **no-suggestions:** append store, configuration, wiring and skeleton no-suggestions x-module ([677590e](https://bitbucket.org/colbenson/x-components/commits/677590ef2fd9892f06d195b4ad858dd10079dd62)), closes [EX-1741](https://searchbroker.atlassian.net/browse/EX-1741)
* **open-button:** add open-button component ([128b0f7](https://bitbucket.org/colbenson/x-components/commits/128b0f7c8a0d41ddebce9501b67d403707923ba2)), closes [EX-1765](https://searchbroker.atlassian.net/browse/EX-1765)
* **popular-searches:** add config to popular-searches x-module ([adcc31f](https://bitbucket.org/colbenson/x-components/commits/adcc31f38a5359bb3c962ad527907f6521793565)), closes [EX-1714](https://searchbroker.atlassian.net/browse/EX-1714)
* **popular-searches:** add popular-searches x-module ([3dd6eaa](https://bitbucket.org/colbenson/x-components/commits/3dd6eaa90a0476c3d6725ff80211127331f58c20)), closes [EX-1610](https://searchbroker.atlassian.net/browse/EX-1610)
* **popular-searches:** append popular searches x-modules events ([9d3b8f6](https://bitbucket.org/colbenson/x-components/commits/9d3b8f62b32025c98feeb0e0c4927da8afbdeb0a)), closes [EX-1713](https://searchbroker.atlassian.net/browse/EX-1713)
* **popular-searches:** append PopularSearch component ([f66da46](https://bitbucket.org/colbenson/x-components/commits/f66da46b03c6c5f68da02b0bb271647bb41942c9)), closes [EX-1717](https://searchbroker.atlassian.net/browse/EX-1717)
* **prettier:** add prettier-organize-imports plugin ([b78370e](https://bitbucket.org/colbenson/x-components/commits/b78370e97bab944621023845fa1293ee79a1e876)), closes [EX-1787](https://searchbroker.atlassian.net/browse/EX-1787)
* **pure-suggestion:** add base suggestion to reuse in every suggestion type ([a20be15](https://bitbucket.org/colbenson/x-components/commits/a20be1516b5660189ffdd0ce220263739c60075b)), closes [EX-1748](https://searchbroker.atlassian.net/browse/EX-1748)
* **query-suggestions:** add query suggestions events ([a2be5e3](https://bitbucket.org/colbenson/x-components/commits/a2be5e3a12781417fe0bca9c9140f5127fbd598d)), closes [EX-1707](https://searchbroker.atlassian.net/browse/EX-1707)
* **query-suggestions:** add query-suggestion component ([b7c2133](https://bitbucket.org/colbenson/x-components/commits/b7c2133df7ef4fcd9ed6c5a34f56381be2f54ad7)), closes [EX-1711](https://searchbroker.atlassian.net/browse/EX-1711)
* **query-suggestions:** add query-suggestions component ([b5e980e](https://bitbucket.org/colbenson/x-components/commits/b5e980e1eb74c676165175d8c79591257c62d91d)), closes [EX-1710](https://searchbroker.atlassian.net/browse/EX-1710)
* **query-suggestions-actions:** refactor actions to an independent files and add test ([9cfda2a](https://bitbucket.org/colbenson/x-components/commits/9cfda2ab8b4b97680d9b5c3dd3c775a429136cf6)), closes [EX-1774](https://searchbroker.atlassian.net/browse/EX-1774)
* **query-suggestions-getters:** refactor getters in separated files and testing ([7b5fe02](https://bitbucket.org/colbenson/x-components/commits/7b5fe028b28fc61c31843266954376462b380b17)), closes [EX-1774](https://searchbroker.atlassian.net/browse/EX-1774)
* **query-suggestions-wiring:** add query suggestions wiring ([500da00](https://bitbucket.org/colbenson/x-components/commits/500da00f13a536d8c73d69c70d9d00019f3b28e7)), closes [EX-1709](https://searchbroker.atlassian.net/browse/EX-1709)
* **recommendations:** create recommendations x-module ([c14a265](https://bitbucket.org/colbenson/x-components/commits/c14a265cd6e939a0598e9ad5fa17d52028156f67)), closes [EX-1917](https://searchbroker.atlassian.net/browse/EX-1917)
* **recommendations:** recommendations actions, getters & mutations ([29b959d](https://bitbucket.org/colbenson/x-components/commits/29b959d8f50c1a3529a0af3700d2fa367771a990)), closes [EX-1918](https://searchbroker.atlassian.net/browse/EX-1918)
* **recommendations:** recommendations component and its test ([9af2d37](https://bitbucket.org/colbenson/x-components/commits/9af2d37f76474c2ebb58bf533051ea3e6149ae28)), closes [EX-1919](https://searchbroker.atlassian.net/browse/EX-1919)
* **recommendations:** recommendations wiring, emitters and events ([77452d9](https://bitbucket.org/colbenson/x-components/commits/77452d91a6a4ceb597590d3ae9c473220284e11b)), closes [EX-1919](https://searchbroker.atlassian.net/browse/EX-1919)
* **related-tags:** add empty related tags module ([e476b22](https://bitbucket.org/colbenson/x-components/commits/e476b224cf87684a40692b8eea349c9124557f80)), closes [EX-1749](https://searchbroker.atlassian.net/browse/EX-1749)
* **related-tags:** add mutations and getters for the related tags module. Add testing for getters ([359d16f](https://bitbucket.org/colbenson/x-components/commits/359d16f201b83bc62f0e404736c7ef96228ee2af)), closes [EX-1749](https://searchbroker.atlassian.net/browse/EX-1749)
* **related-tags:** add related tags actions and testing ([6bedca9](https://bitbucket.org/colbenson/x-components/commits/6bedca920a8a69384014eef4b1d7c6961a7f0122)), closes [EX-1750](https://searchbroker.atlassian.net/browse/EX-1750)
* **related-tags:** add related tags state ([ac4c9c9](https://bitbucket.org/colbenson/x-components/commits/ac4c9c91ecd49a61786b0482cffe4efef6e55ab5)), closes [EX-1749](https://searchbroker.atlassian.net/browse/EX-1749)
* **related-tags:** add wiring and emitters for the related tags ([d7e4af2](https://bitbucket.org/colbenson/x-components/commits/d7e4af27fa540a3994050a80495d16dd63524efd)), closes [EX-1750](https://searchbroker.atlassian.net/browse/EX-1750)
* **related-tags:** add related-tags component ([cb5cf8b](https://bitbucket.org/colbenson/x-components/commits/cb5cf8b390707f19683197f52b4a5c9d75c0d7dc)), closes [EX-1753](https://searchbroker.atlassian.net/browse/EX-1753)
* **related-tags:** add the selected related tags to the request ([dab7b7f](https://bitbucket.org/colbenson/x-components/commits/dab7b7fc38f53e360fa085eb0ee0f9d58af6d365)), closes [EX-1967](https://searchbroker.atlassian.net/browse/EX-1967)
* **result-add-to-cart:** add BaseResultAddToCart component ([ff5a473](https://bitbucket.org/colbenson/x-components/commits/ff5a473e4aef9148505d67efe7be65cf90c7d169)), closes [EX-1914](https://searchbroker.atlassian.net/browse/EX-1914)
* **result-link:** create BaseResultLink component and events associated with it ([54b708a](https://bitbucket.org/colbenson/x-components/commits/54b708a1f895623a4c0f4e8ac5e096162251fa52)), closes [EX-1911](https://searchbroker.atlassian.net/browse/EX-1911)
* **sanitize:** add sanitize function to encode characters in a string ([657d26a](https://bitbucket.org/colbenson/x-components/commits/657d26a851cb93881fed81247edfea72266271a1)), closes [EX-1721](https://searchbroker.atlassian.net/browse/EX-1721)
* **search-box:** add event UserClearedQuery to be emitted when search-box is cleared in any way ([34ae32f](https://bitbucket.org/colbenson/x-components/commits/34ae32f631d5218569ec7a50bf9daf51d4aaab46)), closes [EX-1916](https://searchbroker.atlassian.net/browse/EX-1916)
* **search-box:** add instant search to SearchInput component ([ad02b5b](https://bitbucket.org/colbenson/x-components/commits/ad02b5b710465ad4db02883ce331b72d1cd62d7e)), closes [EX-1934](https://searchbroker.atlassian.net/browse/EX-1934)
* **search-box-config:** add default config for search-box x-module ([d885140](https://bitbucket.org/colbenson/x-components/commits/d885140d0b7020691fb88ab495f1ab6b488b3834)), closes [EX-1678](https://searchbroker.atlassian.net/browse/EX-1678)
* **search-box-module-events:** add new events of search-box module ([9898997](https://bitbucket.org/colbenson/x-components/commits/98989975d514ce43750b881c6a50219eb69cc6d2)), closes [EX-1679](https://searchbroker.atlassian.net/browse/EX-1679)
* **search-box-wiring:** add wires in search-box wiring ([b8ce7a6](https://bitbucket.org/colbenson/x-components/commits/b8ce7a615c909065673697303a5a5ecf3aaf75da)), closes [EX-1664](https://searchbroker.atlassian.net/browse/EX-1664)
* **search-button:** add search-button component ([90812f6](https://bitbucket.org/colbenson/x-components/commits/90812f63b4bb37b665769af7d0966ced0cb164ab)), closes [EX-1662](https://searchbroker.atlassian.net/browse/EX-1662)
* **search-input:** add search input component ([4a384b2](https://bitbucket.org/colbenson/x-components/commits/4a384b2bb13a56cd3ce29d01d86a654c25c7b7e5)), closes [EX-1661](https://searchbroker.atlassian.net/browse/EX-1661)
* **search-types:** include the search-types.api.json file to generate the package documentation ([e2aad39](https://bitbucket.org/colbenson/x-components/commits/e2aad390b889f72bde7f528f93de96ef19c20471)), closes [EX-1776](https://searchbroker.atlassian.net/browse/EX-1776)
* **standard-version:** append ci type into standard version configuration ([025b74d](https://bitbucket.org/colbenson/x-components/commits/025b74da35e61262e82153773c78908bc691ff37)), closes [EX-1723](https://searchbroker.atlassian.net/browse/EX-1723)
* **suggestions:** add suggestions generic component ([0080134](https://bitbucket.org/colbenson/x-components/commits/0080134e7a4e431792051ef610fd1ac0e019410c)), closes [EX-1692](https://searchbroker.atlassian.net/browse/EX-1692)
* **term-suggestions-config:** add term-suggestions config ([2a396cf](https://bitbucket.org/colbenson/x-components/commits/2a396cf2fd64836ea86c90eeefc43c3dacc7d51b)), closes [EX-1708](https://searchbroker.atlassian.net/browse/EX-1708)
* **test-utils:** add utility functions to make easier testing with jest ([6b9e577](https://bitbucket.org/colbenson/x-components/commits/6b9e577830b9d450f458bb1d2f8b0f348a194d94)), closes [EX-1788](https://searchbroker.atlassian.net/browse/EX-1788)
* **ts-doc:** add support to tsdoc and jsdoc eslint plugins ([c68ad15](https://bitbucket.org/colbenson/x-components/commits/c68ad150af4bbc562fec09fe619bb90023836592)), closes [EX-1689](https://searchbroker.atlassian.net/browse/EX-1689)
* **ts-es-lint:** add support to TypeScript ES-lint through new plugin ([abf1fd1](https://bitbucket.org/colbenson/x-components/commits/abf1fd13afd6c490733fe0cc16e712803c8115c2)), closes [EX-1619](https://searchbroker.atlassian.net/browse/EX-1619)
* **utils:** add array and normalize shared utility functions ([67875e0](https://bitbucket.org/colbenson/x-components/commits/67875e0ec900d8f4ca52899ced4b23b2a15cddf9)), closes [EX-1764](https://searchbroker.atlassian.net/browse/EX-1764)
* **utils:** add debounce util ([71bdd63](https://bitbucket.org/colbenson/x-components/commits/71bdd6353a8d2f0455d08d34514059e671db8cea)), closes [EX-1934](https://searchbroker.atlassian.net/browse/EX-1934)
* **vue-styleguidist:** add vue styleguidist to document components ([22f436d](https://bitbucket.org/colbenson/x-components/commits/22f436d9e62a1993f14a835ed1458b55fcfc27a1)), closes [EX-1576](https://searchbroker.atlassian.net/browse/EX-1576)
* **wires-factory:** add implementation to NamespacedWireFactory.wireCommit with a function payload ([2aa1cc7](https://bitbucket.org/colbenson/x-components/commits/2aa1cc7f450c69a35b41741e50957ff1f5296cd5)), closes [EX-1594](https://searchbroker.atlassian.net/browse/EX-1594)
* **wiring:** add WirePayloadParams type and modified NamespacedWireFactory ([3099985](https://bitbucket.org/colbenson/x-components/commits/30999852ba83e888be04c6e07a14d8f5a757da2e)), closes [EX-1594](https://searchbroker.atlassian.net/browse/EX-1594)
* **wiring:** allow wiring operators to access store to retrieve data ([a471289](https://bitbucket.org/colbenson/x-components/commits/a47128949e2c97cb631ecf98b29f00a2021e71a1)), closes [EX-1888](https://searchbroker.atlassian.net/browse/EX-1888)
* **wiring-operators:** add filterWhitelistedModules & filterBlacklistedModules operators ([5e895bc](https://bitbucket.org/colbenson/x-components/commits/5e895bc0eb8a1ed7d7290cbf162031a2b670ac7c)), closes [EX-1618](https://searchbroker.atlassian.net/browse/EX-1618)
* **x-api:** append X API and installX middleware function to install X ([e52441a](https://bitbucket.org/colbenson/x-components/commits/e52441a4f512dcb3dda6c5b10c18fb7348f50c19)), closes [EX-1756](https://searchbroker.atlassian.net/browse/EX-1756)
* **x-component.utils:** add `getXComponentXModuleName` util function ([b705b5b](https://bitbucket.org/colbenson/x-components/commits/b705b5bd9cfac0ec627a143cdf545792a31f9543)), closes [EX-1617](https://searchbroker.atlassian.net/browse/EX-1617)
* **x-plugin:** add a logic to save component configurations to store ([5e57c19](https://bitbucket.org/colbenson/x-components/commits/5e57c191fa2e168adc94e042ba8e3a1c0c9fe5c8)), closes [EX-1603](https://searchbroker.atlassian.net/browse/EX-1603)
* **xon-decorator:** add XOn decorator to handle the subscription/unsubscription of an XEvent ([1ada448](https://bitbucket.org/colbenson/x-components/commits/1ada448caf0dfe67cad15f97092034af3371e564)), closes [EX-1724](https://searchbroker.atlassian.net/browse/EX-1724)
* **xplugin-search-adapter:** extract adapter to XPlugin and add subscription to adapterConfigChanged ([e159189](https://bitbucket.org/colbenson/x-components/commits/e15918908b996d2e90f247dcc8d993d387b186eb)), closes [EX-1605](https://searchbroker.atlassian.net/browse/EX-1605)
* **wiring:** add `createWireFromFunction` wire factory function. Add `filter`, `filterTruthyPayload`, `filterFalsyPayload`, `debounce` & `throttle` wire operator functions ([d0cd25c](https://bitbucket.org/colbenson/x-components/commits/d0cd25cc0e84344ec274929a9dbda827145e0a09)), closes [EX-1623](https://searchbroker.atlassian.net/browse/EX-1623)
* **bus:** remove circular dependency from `BaseXBus` and Vue components. Make bus emit only from root component. ([262d251](https://bitbucket.org/colbenson/x-components/commits/262d251e9f3e52c1bca7163b0c462a5b33693fc6)), closes [EX-1621](https://searchbroker.atlassian.net/browse/EX-1621)
* **build:** add rollup build ([697c007](https://bitbucket.org/colbenson/x-components/commits/697c00734af1ac48635bc31131d93b2a6c012986)), closes [EX-1562](https://searchbroker.atlassian.net/browse/EX-1562)
* **decorators:** add type safe `State` and `Getter` decorators for accessing state and getters in class components ([8e18674](https://bitbucket.org/colbenson/x-components/commits/8e1867422ccceb302e703e737500b5523c86f1b9)), closes [EX-1620](https://searchbroker.atlassian.net/browse/EX-1620)
* **term-suggestions:** add term-suggestions x-module skeleton ([ec1b881](https://bitbucket.org/colbenson/x-components/commits/ec1b8816255296d338300dbd1398c23a48b3cfd4)), closes [EX-1588](https://searchbroker.atlassian.net/browse/EX-1588)
* **search-box:** add search-box x-module skeleton ([f96d496](https://bitbucket.org/colbenson/x-components/commits/f96d49656c1409aa2bdd6085405400c89e3f9b66)), closes [EX-1588](https://searchbroker.atlassian.net/browse/EX-1588)
* **typing:** remove unnecessary `XStoreTree` type ([2335f68](https://bitbucket.org/colbenson/x-components/commits/2335f6817c6b5daec2fe08fa3c564b5cb841a82e)), closes [EX-1612](https://searchbroker.atlassian.net/browse/EX-1612)
* **x-module:** add `withModule` function to create `XModule` scoped wires ([764ab12](https://bitbucket.org/colbenson/x-components/commits/764ab12e47aee10a096496daace5e3c417890a47)), closes [EX-1584](https://searchbroker.atlassian.net/browse/EX-1584)
* **x-module:** remove `Emitters` and `Wiring` generic types from `XModule` ([c1a7c1f](https://bitbucket.org/colbenson/x-components/commits/c1a7c1fdc59daa1a1479967c86b95d6e25b5e39e)), closes [EX-1613](https://searchbroker.atlassian.net/browse/EX-1613)
* **store:** add Store and StoreEmitters to the X-Module ([207ba71](https://bitbucket.org/colbenson/x-components/commits/207ba718d9d59e1c7b2ff6abaa919f73ce1b91fb)), closes [EX-1559](https://searchbroker.atlassian.net/browse/EX-1559)
* **wiring:** add wiring system ([7cb8983](https://bitbucket.org/colbenson/x-components/commits/7cb89836252b63df1db8d18827d7abc6ae3b8987)), closes [EX-1554](https://searchbroker.atlassian.net/browse/EX-1554)
* **wiring-factory:** add wiring factory methods ([c64afda](https://bitbucket.org/colbenson/x-components/commits/c64afda084fa420cd738d61c4ae0b1afdf075b07)), closes [EX-1564](https://searchbroker.atlassian.net/browse/EX-1564)
* **project:** create project with basic shared utils ([5c6b521](https://bitbucket.org/colbenson/x-components/commits/5c6b521d9dc20ab545a940b2734ee8983f857935)), closes [EX-1563](https://searchbroker.atlassian.net/browse/EX-1563)


### Bug Fixes

* **wire-operators:** handle race events for the debounce wire operator ([0019ad3](https://bitbucket.org/colbenson/x-components/commits/0019ad37aa88edf2ee9911e76cfc4d29db908c86)), closes [EX-1944](https://searchbroker.atlassian.net/browse/EX-1944)
* **spatial-navigation:** filter out focusable elements if they can't be focused ([9b4829b](https://bitbucket.org/colbenson/x-components/commits/9b4829b43b0e7d8665400595e3714d9ab1bc4d93)), closes [EX-1924](https://searchbroker.atlassian.net/browse/EX-1924)
* **build:** make build fail if api-extractor has errors ([bdf7b3a](https://bitbucket.org/colbenson/x-components/commits/bdf7b3a051e80f6f0c43a0038745bf45a460112d)), closes [EX-1803](https://searchbroker.atlassian.net/browse/EX-1803)
* **components:** fix vue components exports ([fafc908](https://bitbucket.org/colbenson/x-components/commits/fafc9086b43a6f4b304c028420fcf421f582c56e)), closes [EX-1884](https://searchbroker.atlassian.net/browse/EX-1884)
* **cypress:** fix Cypress webpack/preprocessor config to avoid .ts transpilation file issues ([39645f0](https://bitbucket.org/colbenson/x-components/commits/39645f063e2bde07278e05d1ff6bac4d61134e58)), closes [EX-1870](https://searchbroker.atlassian.net/browse/EX-1870)
* **debounce:** remove wireDebounce to avoid side effects ([ff9abc5](https://bitbucket.org/colbenson/x-components/commits/ff9abc5b7001ddacc2559b36e01ee4798a033e6b)), closes [EX-1955](https://searchbroker.atlassian.net/browse/EX-1955)
* **history-queries:** fix class selector in history queries' e2e test ([72cc49c](https://bitbucket.org/colbenson/x-components/commits/72cc49c7d0d34781632550f8bdc26f568025c98d)), closes [EX-1857](https://searchbroker.atlassian.net/browse/EX-1857)
* **history-queries:** fix history queries removing queries when replacing last stored query ([8cb272f](https://bitbucket.org/colbenson/x-components/commits/8cb272f430ab982069f79627ee2dd10fefc91a65)), closes [EX-1764](https://searchbroker.atlassian.net/browse/EX-1764)
* **jenkins:** add test command for Jenkins CI ([bcef8eb](https://bitbucket.org/colbenson/x-components/commits/bcef8eb5191f44fb6e053e09e3beeb08f918f44b)), closes [EX-1702](https://searchbroker.atlassian.net/browse/EX-1702)
* **jest:** fix testMatch option to look into src instead all project ([fbe126c](https://bitbucket.org/colbenson/x-components/commits/fbe126c12ae83faf36735ed3ea7f6d0ece3ecb9a)), closes [EX-1802](https://searchbroker.atlassian.net/browse/EX-1802)
* **next-queries:** avoid clearing next-queries when the query is empty ([b93bfc7](https://bitbucket.org/colbenson/x-components/commits/b93bfc70ee8fafbf85d94996c036211c652d8ad6)), closes [EX-1880](https://searchbroker.atlassian.net/browse/EX-1880)
* **query-suggestion:** use getter of normalizedQuery to use as query in the component ([30b1099](https://bitbucket.org/colbenson/x-components/commits/30b10993da864c1ac3c3620a7e441408deddd575)), closes [EX-1886](https://searchbroker.atlassian.net/browse/EX-1886)
* **query-suggestions:** fix missing css class, slots docs, slot naming to kebab case and binds ([5b17870](https://bitbucket.org/colbenson/x-components/commits/5b178709703ddde34e6f19d8e28fc7aa3a6acfcd)), closes [EX-1794](https://searchbroker.atlassian.net/browse/EX-1794)
* **request-getters:** avoid constructing a request when the query is empty or has spaces ([519ef93](https://bitbucket.org/colbenson/x-components/commits/519ef93e6e3a13d4e1c406f4d4ef78cfc8c7bcf2)), closes [EX-1881](https://searchbroker.atlassian.net/browse/EX-1881)
* **rxjs:** fix rxjs imports to support rollup commonjs plugin ([bc0ca32](https://bitbucket.org/colbenson/x-components/commits/bc0ca32c52f0cf9398b98b171f072760d7a33e51)), closes [EX-1884](https://searchbroker.atlassian.net/browse/EX-1884)
* **storage-service:** add dummy local storage service for node environment ([60f1891](https://bitbucket.org/colbenson/x-components/commits/60f18911ccba830f8596b2e9acfc575ecc73030b))
* **tests-fix:** fix tests making them wait until Vue updates reactive dependencies ([8497ddd](https://bitbucket.org/colbenson/x-components/commits/8497ddd842cc86bb7e93cce44aacedc3d0c4f6ba)), closes [EX-1697](https://searchbroker.atlassian.net/browse/EX-1697)
* **types:** fix store generic type constraint for Mutations and Actions ([1838f4e](https://bitbucket.org/colbenson/x-components/commits/1838f4ed900c956eac16ca6bb6b505a23fb82320)), closes [EX-1631](https://searchbroker.atlassian.net/browse/EX-1631)
* **vue-styleguidist:** create a props template to overwrite the default styleguidist template ([4d81cff](https://bitbucket.org/colbenson/x-components/commits/4d81cff2816f3d2793c6fb8119860e1587596a46)), closes [EX-1875](https://searchbroker.atlassian.net/browse/EX-1875)
* **vue-styleguidist:** create a vue-docgen slots template to overwrite the default one. Close tags within the documentation between backslashes. ([70e9d54](https://bitbucket.org/colbenson/x-components/commits/70e9d540ff0749673ad0ce0b9e1d7a5fd8e5ff3b)), closes [EX-1875](https://searchbroker.atlassian.net/browse/EX-1875)
* **x-plugin:** make immediate emitters async ([d28d504](https://bitbucket.org/colbenson/x-components/commits/d28d504d21e4c46e8473a02d69465c9dae5dafd1)), closes [EX-1849](https://searchbroker.atlassian.net/browse/EX-1849)
* **x-plugin.mixin:** refactor $x to get root XComponent inside bus emit ([8a54043](https://bitbucket.org/colbenson/x-components/commits/8a5404334e3038fb9d3825c0b324b535d1bb195a)), closes [EX-1698](https://searchbroker.atlassian.net/browse/EX-1698)


### Continuous Integration

* **package.json:** configure E2E tests command for CI Jenkins integration ([3a6e0a5](https://bitbucket.org/colbenson/x-components/commits/3a6e0a5224597d9160bf1519b880ec62c38132bd)), closes [EX-1723](https://searchbroker.atlassian.net/browse/EX-1723)

### Documentation

* **docs:** add static md file to be copied to docs folder on build proccess ([2aa9937](https://bitbucket.org/colbenson/x-components/commits/2aa99377d0811861f12f6a7a9c50985efbad4746)), closes [EX-1943](https://searchbroker.atlassian.net/browse/EX-1943)
* **slots:** fix slot and binding documentations for vue styleguidist ([9edd795](https://bitbucket.org/colbenson/x-components/commits/9edd795f1da6893f582ac5ee938e55111d053fef)), closes [EX-1963](https://searchbroker.atlassian.net/browse/EX-1963)
* **docs:** update the folders structure to create the static-docs and live examples ([5862b0c](https://bitbucket.org/colbenson/x-components/commits/5862b0c57ebd3f116aa4cb044cbe63a7e06722b4)), closes [EX-2017](https://searchbroker.atlassian.net/browse/EX-2017)
* **api-extractor:** add API Extractor to generate the documentation ([6240c7b](https://bitbucket.org/colbenson/x-components/commits/6240c7be3ed9a7a70e6fa9821f6d0524742003f9)), closes [EX-1558](https://searchbroker.atlassian.net/browse/EX-1558)
* **api-extractor:** add missing api extractor marks ([9abb585](https://bitbucket.org/colbenson/x-components/commits/9abb5851b26adfa8540c91745fb7b9c639c8d639)), closes [EX-1617](https://searchbroker.atlassian.net/browse/EX-1617)
* **docgen.config:** fix the naming of the md files generated from components ([53ccfd9](https://bitbucket.org/colbenson/x-components/commits/53ccfd988dee0ea822209329c08a90ad73b7a68f)), closes [EX-1875](https://searchbroker.atlassian.net/browse/EX-1875)
* **history-queries:** fix remove-history-query doc link ([a694eb5](https://bitbucket.org/colbenson/x-components/commits/a694eb58a68c450e9871c62ff4f3cf3fa7525d02)), closes [EX-1778](https://searchbroker.atlassian.net/browse/EX-1778)


### Testing

* **keyboard-navigation:** e2e testing for keyboard-navigation ([18821c5](https://bitbucket.org/colbenson/x-components/commits/18821c5a03b482060995f5adf3bca21e6864ed11)), closes [EX-1924](https://searchbroker.atlassian.net/browse/EX-1924)
* **base-modal-container:** add e2e test to base-modal-container component ([33f6814](https://bitbucket.org/colbenson/x-components/commits/33f68148d22b689da63ba56ff34a8e15dee55a16)), closes [EX-1765](https://searchbroker.atlassian.net/browse/EX-1765)
* **e2e-popular-searches-tests:** add e2e test for popular-searches ([13f1908](https://bitbucket.org/colbenson/x-components/commits/13f190813cc6715e367f1996249d91ddb02a6723)), closes [EX-1761](https://searchbroker.atlassian.net/browse/EX-1761)
* **next-queries:** add e2e test for next queries ([fb83c77](https://bitbucket.org/colbenson/x-components/commits/fb83c7798cd2b3572ed1461631568d543d713840)), closes [EX-1840](https://searchbroker.atlassian.net/browse/EX-1840)
* **no-suggestions:** add e2e tests ([8aeeb3b](https://bitbucket.org/colbenson/x-components/commits/8aeeb3b72ac4713655821bbb5321c897f75ad16a)), closes [EX-1741](https://searchbroker.atlassian.net/browse/EX-1741)
* **x-plugin:** fix tests to use the installNewXPlugin helper ([fc54c61](https://bitbucket.org/colbenson/x-components/commits/fc54c61a612e61f4a530857f6e29d23ab3381768)), closes [EX-1854](https://searchbroker.atlassian.net/browse/EX-1854)



### Code Refactoring

* **base-components:** refactor open and close button components so they're reusable ([398ba29](https://bitbucket.org/colbenson/x-components/commits/398ba294da7c14698ac0fc9de0e7c883fa9a34a5)), closes [EX-1894](https://searchbroker.atlassian.net/browse/EX-1894)
* **tests:** update vue-utils-test version and fix test ([0b0f3b2](https://bitbucket.org/colbenson/x-components/commits/0b0f3b277a56f359d413d2300e75d5b6636931e5)), closes [EX-2000](https://searchbroker.atlassian.net/browse/EX-2000)
* **base-components:** remove pure folder and refactor base components names ([f0e50dc](https://bitbucket.org/colbenson/x-components/commits/f0e50dc506ffd7c6b7d352ef2464dbed8ae2aa8f)), closes [EX-1793](https://searchbroker.atlassian.net/browse/EX-1793)
* **bem-css-classes:** refactor css classes following BEM ([ca72ffc](https://bitbucket.org/colbenson/x-components/commits/ca72ffc115efb0e3494948c77e785145a77bcd31)), closes [EX-1785](https://searchbroker.atlassian.net/browse/EX-1785)
* **bus:** replaced `Subject` with `ReplaySubject` ([8fcdebd](https://bitbucket.org/colbenson/x-components/commits/8fcdebd6bf783b515d46a5362b05fd99e0395d7e)), closes [EX-1849](https://searchbroker.atlassian.net/browse/EX-1849)
* **extractstate & extractgetters types:** refactor ExtractState and ExtractGetters types ([d801c07](https://bitbucket.org/colbenson/x-components/commits/d801c07101b9651a386622330a37597fd94b69c1)), closes [EX-1594](https://searchbroker.atlassian.net/browse/EX-1594)
* **history-queries:** move history queries to the root utils folder ([2e08948](https://bitbucket.org/colbenson/x-components/commits/2e0894817cbd1deba6bc0eddc96d079f1024d6df)), closes [EX-1850](https://searchbroker.atlassian.net/browse/EX-1850)
* **history-queries:** refactor removeFromHistory action to accept a `HistoryQuery` instead of an string ([c3ab74f](https://bitbucket.org/colbenson/x-components/commits/c3ab74f6a2f6fa0a3ba460248879c6e703ed4d06)), closes [EX-1738](https://searchbroker.atlassian.net/browse/EX-1738)
* **history-queries:** rename DeleteHistoryQuery to use keyword `remove` ([601fee4](https://bitbucket.org/colbenson/x-components/commits/601fee475b7a1b4c2e31c8fb5c689a1432b5a52d)), closes [EX-1811](https://searchbroker.atlassian.net/browse/EX-1811)
* **next-queries:** move actions to an independent folder ([2346947](https://bitbucket.org/colbenson/x-components/commits/2346947edf5caed80e7a9ab5d278411d9d35918d)), closes [EX-1836](https://searchbroker.atlassian.net/browse/EX-1836)
* **next-queries:** move getters to an independent folder ([63b5b90](https://bitbucket.org/colbenson/x-components/commits/63b5b9068894780154965b6f54a8fc827925b504)), closes [EX-1836](https://searchbroker.atlassian.net/browse/EX-1836)
* **next-queries:** refactor the next-queries x-module that was already created ([73a0b56](https://bitbucket.org/colbenson/x-components/commits/73a0b56298eefbfc40363fb17b3c1d8aa2d0bc7d)), closes [EX-1729](https://searchbroker.atlassian.net/browse/EX-1729)
* **popular-searches:** extract getters from module ([d44ae00](https://bitbucket.org/colbenson/x-components/commits/d44ae00db8ac69a59c6e22465a988bccea2f3104)), closes [EX-1789](https://searchbroker.atlassian.net/browse/EX-1789)
* **popular-searches:** extract module actions to an independent files ([a0b4db7](https://bitbucket.org/colbenson/x-components/commits/a0b4db7fb33f022a5e9c17cf6745efaf8eacf1b4)), closes [EX-1789](https://searchbroker.atlassian.net/browse/EX-1789)
* **popular-searches:** refactor slot and state names, update docs and refactor variable in test ([6622052](https://bitbucket.org/colbenson/x-components/commits/662205208ef03cc0398cce5be708a114d11fa561)), closes [EX-1786](https://searchbroker.atlassian.net/browse/EX-1786)
* **query-suggestions:** rename term-suggestions to query-suggestions ([84da098](https://bitbucket.org/colbenson/x-components/commits/84da0982b16ee57b80349f2c38c6ce96fbadce3a)), closes [EX-1767](https://searchbroker.atlassian.net/browse/EX-1767)
* **search-input:** refactor to use XOn decorator instead of creating manually subscription ([bd42501](https://bitbucket.org/colbenson/x-components/commits/bd42501f7a9cfb7cdc4a6d5e120c56b14ecf6687)), closes [EX-1781](https://searchbroker.atlassian.net/browse/EX-1781)
* **x-plugin:** extract getters Proxy creation from XPlugin ([800b634](https://bitbucket.org/colbenson/x-components/commits/800b63490bdf85bcdc30820b8765a2d763323278)), closes [EX-1594](https://searchbroker.atlassian.net/browse/EX-1594)
* **x-plugin:** remove global messages object in favour of individual messages ([4fafbad](https://bitbucket.org/colbenson/x-components/commits/4fafbad08bc0cbedf4cf5abb244a92173d8d72ab)), closes [EX-1842](https://searchbroker.atlassian.net/browse/EX-1842)
* **x-plugin:** remove x-plugin singleton and improve testability ([1ce38d5](https://bitbucket.org/colbenson/x-components/commits/1ce38d524c7329a6da95d11a37a84f1114774533)), closes [EX-1854](https://searchbroker.atlassian.net/browse/EX-1854)
* **xevents:** refactor XEvents into their respective module ([dd6663b](https://bitbucket.org/colbenson/x-components/commits/dd6663b9562fc57cd977fed909f6ec6a97394581)), closes [EX-1847](https://searchbroker.atlassian.net/browse/EX-1847)
* **rxjs:** remove rxjs-compat and amend the imports ([213c9e2](https://bitbucket.org/colbenson/x-components/commits/213c9e2d5f7a586a3f1abca8686e3e0926e81980)), closes [EX-2150](https://searchbroker.atlassian.net/browse/EX-2150)

### Build System
* **dependencies:** set minimum supported versions of Vue and Vuex dependencies ([c18434b](https://bitbucket.org/colbenson/x-components/commits/c18434be285b8a666c7600daff2486dfe1ad440a)), closes [EX-2109](https://searchbroker.atlassian.net/browse/EX-2109)
* **browserslist:** add browserslist configuration ([53192b8](https://bitbucket.org/colbenson/x-components/commits/53192b84059ec3589a1a37187e0b244f1a175b2c)), closes [EX-1561](https://searchbroker.atlassian.net/browse/EX-1561)
* **dependencies:** update `[@empathy](https://bitbucket.org/empathy)` dependencies ([3a657b1](https://bitbucket.org/colbenson/x-components/commits/3a657b1d5d5203671cd1e1624e5630a153a68fde)), closes [EX-1903](https://searchbroker.atlassian.net/browse/EX-1903)
* **dependencies:** update dependencies to match with the rest of the projects ([ab64828](https://bitbucket.org/colbenson/x-components/commits/ab648286f9ca7397d9f14f3d6eb5095ef8139c14)), closes [EX-1884](https://searchbroker.atlassian.net/browse/EX-1884)
