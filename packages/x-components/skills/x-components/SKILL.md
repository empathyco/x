---
name: x-components
description: 'Vue 3 + Vuex search UI components from @empathyco/x-components: x-modules for results (ResultsList, BannersList, PromotedsList), facets and filters (Facets, SimpleFilter, NumberRangeFilter, SliderFilter, SelectedFiltersList), search box, suggestions, queries preview and AI carousels, plus base building blocks (BaseResultImage, BaseGrid, BaseModal) and X events. Use when adding, wiring or fixing search UI in a project that depends on @empathyco/x-components: filters or price ranges, facets, sorting, result grids or carousels, product images or prices not rendering, modals, X-Bus events.'
---

<!-- skills-check packages: @empathyco/x-components, @empathyco/x-adapter-platform -->
<!-- skills-check ignore: DefaultResultsEnrichmentService, rootComponent, domElement, xModules, snippetConfig, durationInSeconds, scrollLock -->

# @empathyco/x-components

Vue 3 + Vuex 4 components to build a search and discovery UI. Peer dependencies: `vue ^3.5`
and `vuex 4.0.2` (exact).

## Import rule (read first)

- The package root only exports **core**: base components, animations, icons, composables,
  the X plugin and the installer.
- Every **x-module** has its own subpath, and importing it registers the module:
  `/search`, `/facets`, `/search-box`, `/query-suggestions`, `/popular-searches`,
  `/history-queries`, `/next-queries`, `/related-tags`, `/related-prompts`, `/recommendations`,
  `/queries-preview`, `/semantic-queries`, `/identifier-results`, `/ai`, `/browse`, `/scroll`,
  `/url`, `/tagging`, `/extra-params`, `/device`, `/empathize`, `/experience-controls`, `/vendor`.
- If a component is not in the root, look for it in a module before writing your own.

```ts
import { BaseGrid, BaseResultImage, use$x } from '@empathyco/x-components'
import { Facets, SimpleFilter } from '@empathyco/x-components/facets'
import { ResultsList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
```

## Where to find the exact API

Never guess a name, prop or event. The installed package ships its generated reference:

- Exported names: search `node_modules/@empathyco/x-components/report/x-components.api.md`
  (large file — grep it, do not read it whole).
- Props, events, slots and examples of each component:
  `node_modules/@empathyco/x-components/docs/API-reference/components/<module>/x-components.<kebab-name>.md`
  (for example `common/modals/x-components.base-modal.md`). Some examples there import from
  `@empathyco/x-components/animations` or `/url-handler`; those subpaths do not exist — use the
  root and `/url`.

## Setup

- `XInstaller` creates the app and the `window.InterfaceX` API:
  `new XInstaller(options).init(snippetConfig)`. Options include `adapter` (usually
  `platformAdapter` from `@empathyco/x-adapter-platform`), `rootComponent`, `domElement` and
  `xModules`. `SnippetConfig` carries `instance`, `scope`, `lang`, `currency`, `callbacks`…
- `XInstaller` installs an `XPlugin`, which sets up the X-Bus, the store and the emitters; do
  not install it a second time.
- State and events from components: `use$x`, `useState`, `useGetter`, `useXBus`; the bus
  instance is `bus`.

## Core building blocks

- Results: `BaseResultImage`, `BaseResultCurrentPrice`, `BaseResultPreviousPrice`,
  `BaseResultRating`, `BaseResultLink`, `BaseFallbackImage`, `BasePlaceholderImage`,
  `BaseAddToCart`, `ResultVariantSelector`, `ResultVariantsProvider`.
- Layout: `BaseGrid`, `BaseVariableColumnGrid`, `BaseColumnPickerDropdown`,
  `BaseColumnPickerList`, `SlidingPanel` (horizontal scroller with arrow buttons — a carousel,
  not a side drawer), `BaseScroll` (emits scroll direction / start / end events).
- Panels and modals: `BaseTogglePanel`, `BaseHeaderTogglePanel`, `BaseTabsPanel`,
  `BaseIdTogglePanel` (needs a `BaseIdTogglePanelButton` with the same id), `BaseModal`,
  `MainModal`, `OpenMainModal`, `CloseMainModal`, `BaseEventsModal`, `BaseIdModal`, `Tabs`.
- Controls: `BaseDropdown`, `BaseSwitch`, `BaseSlider` (noUiSlider), `BaseRating`,
  `BaseEventButton` (emits X events), `PageLoaderButton`, `PageSelector`, `SortDropdown`,
  `SortList`, `SortPickerList`, `BaseCurrency` (accepts `locale`).
- Suggestions: `BaseSuggestions`, `BaseSuggestion`, `ItemsList`, `Highlight` (highlights any
  `highlight` substring in a `text`).
- Events and tracking: `GlobalXBus` (component to listen to X events — not the bus itself),
  `SnippetCallbacks` (runs `snippetConfig.callbacks` on X events), `DisplayEmitter`,
  `DisplayClickProvider`, `LocationProvider`.
- Animations are separate components (`Fade`, `CrossFade`, `CollapseHeight`,
  `StaggeredFadeAndSlide`, `NoAnimation`…). Icons are separate components too (`SearchIcon`,
  `CartIcon`…); check the report for exact names.
- `AutoProgressBar` is a timed animation (`durationInSeconds`), used for redirection
  countdowns — not a request loading indicator. `Message` is a plain content wrapper.

## Common mistakes

- Importing module components from the root (`ResultsList`, `Facets`, `SearchInput` are not
  there).
- `BaseModal` is controlled by its `open` prop and only emits `click:overlay` and
  `focusin:body`; it locks page scroll unless `scrollLock` is `false`.
- `BaseTeleport` defaults to `position="onlychild"`, which hides the other children of the
  target element.
- Inventing `BaseResult*` names: fallback, placeholder and add-to-cart pieces are
  `BaseFallbackImage`, `BasePlaceholderImage` and `BaseAddToCart`.
- Results enrichment was removed in v9 (`DefaultResultsEnrichmentService` no longer exists);
  check `CHANGELOG.md` in the package for other breaking changes.
