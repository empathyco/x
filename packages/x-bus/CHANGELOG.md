# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.0-alpha.2](https://github.com/empathyco/x/compare/@empathyco/x-bus@1.0.0-alpha.1...@empathyco/x-bus@1.0.0-alpha.2) (2023-06-07)

**Note:** Version bump only for package @empathyco/x-bus





## [1.0.0-alpha.1](https://github.com/empathyco/x/compare/@empathyco/x-bus@1.0.0-alpha.0...@empathyco/x-bus@1.0.0-alpha.1) (2023-06-06)

**Note:** Version bump only for package @empathyco/x-bus





## [1.0.0-alpha.0](https://github.com/empathyco/x/compare/@empathyco/x-bus@0.1.0-alpha.12...@empathyco/x-bus@1.0.0-alpha.0) (2023-05-11)


### ⚠ BREAKING CHANGES

* **deps:** minimum node version required is 18.
* **deps:** minimum version required is node v18

EMP-274

### Continuous Integration

* parallelize steps (#1174) ([3013595](https://github.com/empathyco/x/commit/3013595857c8dac33f36b2c0d08e747b0735c6a0))
* restore build workflow (#1194) ([076ee49](https://github.com/empathyco/x/commit/076ee492388ba000ebdfa49d9f4356562c8bef19))


### Others

* **deps:** update node to 18 (#1196) ([e0e6b35](https://github.com/empathyco/x/commit/e0e6b35eefb3ef83f22e341f662475b0e6066e94))
* **deps:** update node to v18 (#1175) ([14e64e1](https://github.com/empathyco/x/commit/14e64e11fdf7f3d27d59baf56b027857df9e61e7))



## [0.1.0-alpha.12](https://github.com/empathyco/x/compare/@empathyco/x-bus@0.1.0-alpha.11...@empathyco/x-bus@0.1.0-alpha.12) (2023-05-03)

**Note:** Version bump only for package @empathyco/x-bus

## [0.1.0-alpha.11](https://github.com/empathyco/x/compare/@empathyco/x-bus@0.1.0-alpha.10...@empathyco/x-bus@0.1.0-alpha.11) (2023-04-12)

**Note:** Version bump only for package @empathyco/x-bus

## [0.1.0-alpha.10](https://github.com/empathyco/x/compare/@empathyco/x-bus@0.1.0-alpha.9...@empathyco/x-bus@0.1.0-alpha.10) (2023-03-16)

### Features

- **plugin:** replace old bus implementation using the new `x-priority-bus` (#1086)
  ([f64f9b6](https://github.com/empathyco/x/commit/f64f9b68225c4ee422eb007784e0eec813c95228)),
  closes [EX-7283](https://searchbroker.atlassian.net/browse/EX-7283)

## [0.1.0-alpha.9](https://github.com/empathyco/x/compare/@empathyco/x-bus@0.1.0-alpha.8...@empathyco/x-bus@0.1.0-alpha.9) (2023-03-07)

### Bug Fixes

- **deps:** remove `only-allow` pnpm (#1097)
  ([b2a63d3](https://github.com/empathyco/x/commit/b2a63d308f20804d55a266189ab5d6242f88f6d8)),
  closes [EX-8082](https://searchbroker.atlassian.net/browse/EX-8082)

## [0.1.0-alpha.8](https://github.com/empathyco/x/compare/@empathyco/x-bus@0.1.0-alpha.7...@empathyco/x-bus@0.1.0-alpha.8) (2023-02-08)

### Continuous Integration

- refactor `lint` command to benefit from `nx parallelisation` (#1051)
  ([1af1503](https://github.com/empathyco/x/commit/1af1503ff118d6232fdbb27e203037a89b1b52e0)),
  closes [EX-7926](https://searchbroker.atlassian.net/browse/EX-7926)

## [0.1.0-alpha.7](https://github.com/empathyco/x/compare/@empathyco/x-bus@0.1.0-alpha.6...@empathyco/x-bus@0.1.0-alpha.7) (2023-02-07)

### Continuous Integration

- migrate from `npm` & `lerna bootstrap` to `pnpm` (#1047)
  ([aaaba4f](https://github.com/empathyco/x/commit/aaaba4f8a5498c16e17ea6daf9c18a1f49918f70)),
  closes [EX-7891](https://searchbroker.atlassian.net/browse/EX-7891)

## [0.1.0-alpha.6](https://github.com/empathyco/x/compare/@empathyco/x-bus@0.1.0-alpha.5...@empathyco/x-bus@0.1.0-alpha.6) (2023-02-01)

### Bug Fixes

- add missing `rxjs` dependency and narrow `setTimeout` type (#1052)
  ([86d64b4](https://github.com/empathyco/x/commit/86d64b4be7249bcb802982dfb5690688e35b88c9)),
  closes [EX-7928](https://searchbroker.atlassian.net/browse/EX-7928)

## [0.1.0-alpha.5](https://github.com/empathyco/x/compare/@empathyco/x-bus@0.1.0-alpha.4...@empathyco/x-bus@0.1.0-alpha.5) (2023-01-25)

### Features

- add `x-priority-bus` (#990)
  ([718d3d2](https://github.com/empathyco/x/commit/718d3d278e58a0f0d173ff4511245d59b1e6f036)),
  closes [EX-7458](https://searchbroker.atlassian.net/browse/EX-7458)

### Build System

- **dependencies:** update `typescript` to `4.9.4` and its dependencies to their latest version
  (#993)
  ([500ab57](https://github.com/empathyco/x/commit/500ab57e4729f5c4dcefaa31ed4a8497ddd349b9)),
  closes [EX-7288](https://searchbroker.atlassian.net/browse/EX-7288)

## [0.1.0-alpha.4](https://github.com/empathyco/x/compare/@empathyco/x-bus@0.1.0-alpha.3...@empathyco/x-bus@0.1.0-alpha.4) (2023-01-20)

**Note:** Version bump only for package @empathyco/x-bus

## [0.1.0-alpha.3](https://github.com/empathyco/x/compare/@empathyco/x-bus@0.1.0-alpha.2...@empathyco/x-bus@0.1.0-alpha.3) (2023-01-06)

### Build System

- **deps:** update dependencies
  ([491f9c5](https://github.com/empathyco/x/commit/491f9c5a27cf5eaa4dc3f31c97ea514bb8f3515b))

## [0.1.0-alpha.2](https://github.com/empathyco/x/compare/@empathyco/x-bus@0.1.0-alpha.1...@empathyco/x-bus@0.1.0-alpha.2) (2022-12-16)

### Continuous Integration

- use matrix steps and jest projects (#919)
  ([dec53f5](https://github.com/empathyco/x/commit/dec53f5da572a4a5f3c8519222c1ed94ed981967))

## 0.1.0-alpha.1 (2022-11-17)

**Note:** Version bump only for package @empathyco/x-bus
