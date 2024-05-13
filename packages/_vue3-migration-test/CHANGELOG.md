# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.0-alpha.8](https://github.com/empathyco/x/compare/vue3-migration-test@1.0.0-alpha.7...vue3-migration-test@1.0.0-alpha.8) (2024-05-13)


### Features

* replace `AnimationsMixin` with `useCollapseAnimation` composable (#1468) ([e3ee9d9](https://github.com/empathyco/x/commit/e3ee9d94f9acc4abdcd1c591a754c86d9a6abbb7))



## [1.0.0-alpha.7](https://github.com/empathyco/x/compare/vue3-migration-test@1.0.0-alpha.6...vue3-migration-test@1.0.0-alpha.7) (2024-05-09)


### Features

* Replace FacetsMixin by useFacets composable (#1462) ([bb7e0ce](https://github.com/empathyco/x/commit/bb7e0cede8653d82e436db696e80c1bdbcb9cc41))



## [1.0.0-alpha.6](https://github.com/empathyco/x/compare/vue3-migration-test@1.0.0-alpha.5...vue3-migration-test@1.0.0-alpha.6) (2024-05-09)


### Features

* migrate `ItemsListInjection` mixin (#1460) ([a89fb51](https://github.com/empathyco/x/commit/a89fb5179de040695f13d56f43de50917e1c7f97))



## [1.0.0-alpha.5](https://github.com/empathyco/x/compare/vue3-migration-test@1.0.0-alpha.4...vue3-migration-test@1.0.0-alpha.5) (2024-05-08)


### ⚠ BREAKING CHANGES

* `MainScroll` drops the usage of `NoElement` as root element and uses a div instead. This extra div could break the style of an application that relies on `MainScroll` rendering their content directly.
`MainScrollItem` drops the usage of `NoElement` if no `tag` prop is passed and uses a div as fallback.

### Features

* migrate `MainScroll` and `MainScrollItem` components (#1456) ([b720132](https://github.com/empathyco/x/commit/b7201322bbf1f5696e80e00622d21d653228177c))



## [1.0.0-alpha.4](https://github.com/empathyco/x/compare/vue3-migration-test@1.0.0-alpha.3...vue3-migration-test@1.0.0-alpha.4) (2024-05-06)


### ⚠ BREAKING CHANGES

* **ColumnPickerMixin:** `BaseColumnPickerDropdown` component will no longer emit the `change` event, use `update:modelValue` instead. 
`BaseColumnPickerDropdown` prop for the selected columns was renamed from `value` to `modelValue`.

`BaseColumnPickerList` component will no longer emit the `change` event, use `update:modelValue` instead. 
`BaseColumnPickerList` prop for the selected columns was renamed from `value` to `modelValue`.

`ColumnPickerMixin` has been removed.

### Code Refactoring

* **ColumnPickerMixin:** get rid of `ColumnPickerMixin` and refactor components which use it (#1461) ([c5b84da](https://github.com/empathyco/x/commit/c5b84da32b75a37d028e91b64220016a2cfb3037))



## [1.0.0-alpha.3](https://github.com/empathyco/x/compare/vue3-migration-test@1.0.0-alpha.2...vue3-migration-test@1.0.0-alpha.3) (2024-05-03)

**Note:** Version bump only for package vue3-migration-test





## [1.0.0-alpha.2](https://github.com/empathyco/x/compare/vue3-migration-test@1.0.0-alpha.1...vue3-migration-test@1.0.0-alpha.2) (2024-05-01)


### Testing

* add Sort components to Vue 3 migration test (#1454) ([7ccffb0](https://github.com/empathyco/x/commit/7ccffb084cdf6521c57977eca4d19d93f6586a2d))



## [1.0.0-alpha.1](https://github.com/empathyco/x/compare/vue3-migration-test@1.0.0-alpha.0...vue3-migration-test@1.0.0-alpha.1) (2024-05-01)


### Code Refactoring

* **base-event-button:** migrate base-event-button component to Composition API (#1457) ([39a7a8e](https://github.com/empathyco/x/commit/39a7a8ed4767ae78d447e6ddca530c41f9f681dc))



## [1.0.0-alpha.0](https://github.com/empathyco/x/compare/vue3-migration-test@0.1.0-alpha.0...vue3-migration-test@1.0.0-alpha.0) (2024-04-24)


### ⚠ BREAKING CHANGES

* **sort-mixin:** base-dropdown component will no longer emit the `change` event, use `update:modelValue` instead. 
base-dropdown prop for the selected item was renamed from `value` to `modelValue`.

### Code Refactoring

* **sort-mixin:** get rid of SortMixin and refactor components which use it (#1448) ([de0a287](https://github.com/empathyco/x/commit/de0a28754d8fefe8c4db6aa7b7cb5d8407016be2))



## 0.1.0-alpha.0 (2024-04-19)


### Features

* Add VUE_COMPAT_MODE env variable ([759e8ef](https://github.com/empathyco/x/commit/759e8ef221ef2159dd46faf816dc5f00b5919dc4))
* EMP-3849 Create vue3-migration-test package ([399fe51](https://github.com/empathyco/x/commit/399fe5176b8c0a5206ed7da4edf9c54c1219f70b))
* Improve vue3-migration-test playground ([8ebe98e](https://github.com/empathyco/x/commit/8ebe98e6e8ba57bfc471a21ef67a24aa6adc8dc0))


### Bug Fixes

* Fix @vue/compat alias for x-components imports ([d6d7e2f](https://github.com/empathyco/x/commit/d6d7e2f26e6944af7453c213b8d0a1d28ff359eb))


### Build System

* Exclude x-components from pre-bundling in vue3-migration-test ([37b9bcb](https://github.com/empathyco/x/commit/37b9bcbc83bc51132708997497493d71be40ec21))


### Code Refactoring

* Use script setup ([89ceb6f](https://github.com/empathyco/x/commit/89ceb6f12971596bc1d4c2baa6fe85e7dc2f4dc4))
