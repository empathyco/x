# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.1.0-alpha.2](https://github.com/empathyco/x/compare/@empathyco/x-react-wrapper@3.1.0-alpha.1...@empathyco/x-react-wrapper@3.1.0-alpha.2) (2021-08-05)

**Note:** Version bump only for package @empathyco/x-react-wrapper





## [3.1.0-alpha.1](https://github.com/empathyco/x/compare/@empathyco/x-react-wrapper@3.1.0-alpha.0...@empathyco/x-react-wrapper@3.1.0-alpha.1) (2021-08-05)


### Features

* **facets-next:** add `HierarchicalFilterEntity` (#75) ([d633721](https://github.com/empathyco/x/commit/d633721b6c795ee9145925d366216edd616b0807)), closes [EX-4354](https://searchbroker.atlassian.net/browse/EX-4354)


### Build System

* upgrade dependencies ([b1d0e5d](https://github.com/empathyco/x/commit/b1d0e5df03cd48f3bb285830943bddf9bdc17acf)), closes [EX-4506](https://searchbroker.atlassian.net/browse/EX-4506)



## [3.1.0-alpha.0](https://github.com/empathyco/x/compare/@empathyco/x-react-wrapper@3.0.1-alpha.1...@empathyco/x-react-wrapper@3.1.0-alpha.0) (2021-08-03)


### Build System

* Update TypeScript to 4.3.5.Update TSLib to 2.3.5. ([4cebdfc](https://github.com/empathyco/x/commit/4cebdfc11e1520552a687def3eda1bf0c132e031)), closes [EX-4435](https://searchbroker.atlassian.net/browse/EX-4435)



### [3.0.1-alpha.1](https://github.com/empathyco/x/compare/@empathyco/x-react-wrapper@3.0.1-alpha.0...@empathyco/x-react-wrapper@3.0.1-alpha.1) (2021-07-29)

**Note:** Version bump only for package @empathyco/x-react-wrapper





### 3.0.1-alpha.0 (2021-07-28)

**Note:** Version bump only for package @empathyco/x-react-wrapper





# React Wrapper
## [3.0.0](https://bitbucket.org/colbenson/react-wrapper/branches/compare/v3.0.0%0Dv2.0.0) (2021-02-18)


### Features

* **slots:** support using standard React components inside slots ([489cc0c](https://bitbucket.org/colbenson/react-wrapper/commits/489cc0cfa8eab5e71233bba541bf2257d3bbbaa0)), closes [EX-2901](https://searchbroker.atlassian.net/browse/EX-2901)

### ⚠ BREAKING CHANGES

* **slots:** Scoped slots do not longer support primitive properties. They can only pass objects with named props.

## [2.0.0](https://bitbucket.org/colbenson/react-wrapper/branches/compare/v2.0.0%0Dv1.0.4) (2021-01-05)


### ⚠ BREAKING CHANGES

* **slots:** ReactWrapper slots renders a wrapper `div` with the class `react-wrapper-slot`.
* **react-wrapper:** ReactWrapper component now renders a `div` with the class `react-wrapper`. Inside this `div` the vue content is rendered. You can pass custom CSS classes to this div using the `className` prop.

### Bug Fixes

* **react-wrapper:** make react-wrapper render a wrapper div so sibling elements can be properly updated. ([e1dab57](https://bitbucket.org/colbenson/react-wrapper/commits/e1dab576e2d66f73e075e85abcf0396a69201dc3)), closes [EX-2809](https://searchbroker.atlassian.net/browse/EX-2809)
* **slots:** make react-wrapper slots render a wrapper div so children can be properly updated. ([ddf0f55](https://bitbucket.org/colbenson/react-wrapper/commits/ddf0f551bd4f19c1beaf737c5e5a50d3f5e24302)), closes [EX-2854](https://searchbroker.atlassian.net/browse/EX-2854)

### [1.0.4](https://bitbucket.org/colbenson/react-wrapper/branches/compare/v1.0.4%0Dv1.0.3) (2020-12-03)


### Bug Fixes

* **children:** fix children unmount fails if parentElement is removed too ([3903554](https://bitbucket.org/colbenson/react-wrapper/commits/3903554dc4a770f0f5a47f47d9600a853943e9fc)), closes [EX-2732](https://searchbroker.atlassian.net/browse/EX-2732)

### [1.0.3](https://bitbucket.org/colbenson/react-wrapper/branches/compare/v1.0.3%0Dv1.0.2) (2020-11-05)


### Bug Fixes

* **slots:** add support to text content in slots ([039ee3f](https://bitbucket.org/colbenson/react-wrapper/commits/039ee3f53f00241d2ea1bb879ba4c047d359c636)), closes [EX-2525](https://searchbroker.atlassian.net/browse/EX-2525)

### [1.0.2](https://bitbucket.org/colbenson/react-wrapper/branches/compare/v1.0.2%0Dv1.0.1) (2020-10-29)


### Bug Fixes

* **slots:** check if VueChildrenWrapper is unmounted before unmounting React Component ([0841e0d](https://bitbucket.org/colbenson/react-wrapper/commits/0841e0db8843722d784dc9371bf52e2fc63a2e51)), closes [EX-2425](https://searchbroker.atlassian.net/browse/EX-2425)

### [1.0.1](https://bitbucket.org/colbenson/react-wrapper/branches/compare/v1.0.1%0Dv1.0.0) (2020-10-19)


### Bug Fixes

* **slots:** avoid creating new HTML elements for slots when the react-wrapper is re-rendered. ([24e6142](https://bitbucket.org/colbenson/react-wrapper/commits/24e61426442671a3a8293a140fd93ae81dacd77f)), closes [EX-2330](https://searchbroker.atlassian.net/browse/EX-2330)


### Documentation

* add documentation with the usage and architecture ([3a0982b](https://bitbucket.org/colbenson/react-wrapper/commits/3a0982b2074eaf1a10a52bf29361d85330c75d79)), closes [EX-2390](https://searchbroker.atlassian.net/browse/EX-2390)

## 1.0.0 (2020-07-31)


### Features

* **linter:** use eslint-plugin-x ([2d9298b](https://bitbucket.org/colbenson/react-wrapper/commits/2d9298b81d5275e3e17f34a2af0e55a485160875)), closes [EX-1946](https://searchbroker.atlassian.net/browse/EX-1946)
* **react-wrapper:** add events support ([436481b](https://bitbucket.org/colbenson/react-wrapper/commits/436481be18a27a295767a3ca524ddbf6f26be5e8)), closes [EX-1885](https://searchbroker.atlassian.net/browse/EX-1885)
* **react-wrapper:** add slots support ([edcfb51](https://bitbucket.org/colbenson/react-wrapper/commits/edcfb51a050a740a716c8573f5ea35dea6bf7259)), closes [EX-1791](https://searchbroker.atlassian.net/browse/EX-1791)
* **react-wrapper:** add events support ([436481b](https://bitbucket.org/colbenson/react-wrapper/commits/436481be18a27a295767a3ca524ddbf6f26be5e8)), closes [EX-1885](https://searchbroker.atlassian.net/browse/EX-1885)
* **react-wrapper:** add slots support ([edcfb51](https://bitbucket.org/colbenson/react-wrapper/commits/edcfb51a050a740a716c8573f5ea35dea6bf7259)), closes [EX-1791](https://searchbroker.atlassian.net/browse/EX-1791)
* **react-wrapper:** create react-wrapper with props syncing support ([ccfe6b2](https://bitbucket.org/colbenson/react-wrapper/commits/ccfe6b20f0d5ef7f0fd0ecd168cee492b8f0a529)), closes [EX-1696](https://searchbroker.atlassian.net/browse/EX-1696)


### Code Refactoring

* **linter:** add eslint, prettier and commitizen support ([290d103](https://bitbucket.org/colbenson/react-wrapper/commits/290d103d0fad4987a649ae423a2c025532f8b3c2)), closes [EX-1885](https://searchbroker.atlassian.net/browse/EX-1885)
* **vue-wrapper:** remove vue-wrapper and its testing ([508ea3e](https://bitbucket.org/colbenson/react-wrapper/commits/508ea3ee11864e821b52fdf2858344dc8dd417ff)), closes [EX-1885](https://searchbroker.atlassian.net/browse/EX-1885)
* **vue-wrapper:** remove vue-wrapper and its testing ([a9d9cc0](https://bitbucket.org/colbenson/react-wrapper/commits/a9d9cc022876550f5f87aa801a5dec9deec7b4fb)), closes [EX-1885](https://searchbroker.atlassian.net/browse/EX-1885)
* **linter:** add eslint, prettier and commitizen support ([290d103](https://bitbucket.org/colbenson/react-wrapper/commits/290d103d0fad4987a649ae423a2c025532f8b3c2)), closes [EX-1885](https://searchbroker.atlassian.net/browse/EX-1885)
