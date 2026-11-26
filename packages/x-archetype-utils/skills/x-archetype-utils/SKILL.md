---
name: x-archetype-utils
description: 'Build and runtime helpers for x-archetype based projects (@empathyco/x-archetype-utils): CssInjector for injecting X component styles at runtime, rollupCssInjectorConfig and webpackConfig. Use when configuring how X component CSS is injected, or adapting the build of an x-archetype project.'
---

<!-- skills-check ignore: transpileDependencies, configureWebpack -->

# @empathyco/x-archetype-utils

Helpers for projects based on x-archetype. It has no runtime dependencies and no longer
ships an i18n helper: use `vue-i18n` directly in the project.

## CSS injection

- `cssInjector` is the shared `CssInjector` instance (a singleton, also exposed on
  `window.xCSSInjector`); X component styles are added through it.
- `rollupCssInjectorConfig` holds the options for the rollup `replace` and `styles` plugins
  that redirect the CSS injection of x-components to `window.xCSSInjector`.

## webpackConfig

A Vue CLI configuration fragment (`transpileDependencies`, `configureWebpack`) to spread into
`vue.config.js` — not a standalone webpack config.
