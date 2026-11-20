---
name: x-archetype-utils
description: 'Build and runtime helpers for x-archetype based projects (@empathyco/x-archetype-utils): I18n (vue-i18n wrapper with per-device messages), CssInjector for injecting X component styles at runtime, rollupCssInjectorConfig and webpackConfig. Use when setting up translations or switching locale/device, configuring how X component CSS is injected, or adapting the build of an x-archetype project.'
---

<!-- skills-check ignore: setLocale, setDevice, transpileDependencies, configureWebpack -->

# @empathyco/x-archetype-utils

Helpers for projects based on x-archetype. Peer dependencies: `vue` and `vue-i18n` 9.

## I18n

- Create it with `await I18n.create(options)`. `new I18n(options)` does **not** load the
  messages, so installing it renders empty texts.
- `setLocale(locale)` and `setDevice(device)` load and switch messages at runtime.
- Messages are grouped by device: `MessagesByDevice` has a `base` set plus one per device.

## CSS injection

- `cssInjector` is the shared `CssInjector` instance (a singleton, also exposed on
  `window.xCSSInjector`); X component styles are added through it.
- `rollupCssInjectorConfig` holds the options for the rollup `replace` and `styles` plugins
  that redirect the CSS injection of x-components to `window.xCSSInjector`.

## webpackConfig

A Vue CLI configuration fragment (`transpileDependencies`, `configureWebpack`) to spread into
`vue.config.js` — not a standalone webpack config.
