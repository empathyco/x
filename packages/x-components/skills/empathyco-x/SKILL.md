---
name: empathyco-x
description: 'Interface X (Empathy) ecosystem overview: Vue 3 commerce search and discovery UI built from the @empathyco/x-* packages (x-components, x-adapter, x-adapter-platform, x-types, x-utils, x-design-system, x-archetype-utils). Use when starting or integrating an Empathy search experience, deciding which @empathyco package owns a feature (UI component, API mapping, data model, styling), or wiring x-components modules to an API adapter. Each package has its own skill with the detailed API.'
---

<!-- skills-check packages: @empathyco/x-components, @empathyco/x-adapter-platform, @empathyco/x-adapter, @empathyco/x-types, @empathyco/x-utils, @empathyco/x-archetype-utils -->

# Interface X (Empathy) ecosystem

Interface X is Empathy's open-source ecosystem for commerce search and discovery UIs with
Vue 3. It is a set of `@empathyco` npm packages; each one ships a skill with its API details
(`x-components`, `x-adapter`, `x-adapter-platform`, `x-types`, `x-utils`, `x-design-system`,
`x-archetype-utils`). Activate the package skill when you need them.

## Which package owns what

- `@empathyco/x-components` — the core: Vue 3 components, x-modules (search, search-box,
  facets, AI, browse, tagging, url, …), X-Bus, store and plugins. Module components are
  imported from subpaths (`@empathyco/x-components/search`), not from the root.
- `@empathyco/x-adapter` — generic API client framework: endpoint adapters, mappers, mutable
  schemas and HTTP clients.
- `@empathyco/x-adapter-platform` — Empathy Platform endpoints and schemas built on
  x-adapter; exposes `platformAdapter`.
- `@empathyco/x-types` — shared data models, type guards and Vitest test schemas.
- `@empathyco/x-utils` — session/storage services and object helpers such as `deepMerge`.
- `@empathyco/x-design-system` — Tailwind CSS v4 styles; every utility uses the `xds:` prefix.
- `@empathyco/x-archetype-utils` — i18n, runtime CSS injection and build helpers for
  x-archetype projects.

## Typical integration flow

1. Install `@empathyco/x-components` (it depends on x-adapter, x-adapter-platform, x-types and
   x-utils) plus `vue` 3 and `vuex` 4.0.2.
2. Create the app with `XInstaller` (`new XInstaller(options).init(snippetConfig)`), which
   installs an `XPlugin` (X-Bus, Vuex store, emitters) and exposes `window.InterfaceX`.
3. Pick the x-modules you need — each bundles its components, store logic and event wiring —
   and pass an API adapter: `platformAdapter` from `@empathyco/x-adapter-platform` by default.
4. Style the UI with `@empathyco/x-design-system` in a Tailwind v4 pipeline, or with your own
   styles.

## Documentation

- Exact exported names: `report/*.api.md` inside x-components, x-types and
  x-adapter-platform in `node_modules`.
- Component props, events and slots: `node_modules/@empathyco/x-components/docs/API-reference/components/`.
- Product docs: https://docs.empathy.co
