# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
