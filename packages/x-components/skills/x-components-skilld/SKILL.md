---
name: x-components-skilld
description: Vue 3 component library for building commerce search & discovery experiences
---

# X Components - Empathy Search UI Component Library

## Overview

**@empathyco/x-components** is the core Vue 3 component library for building commerce search & discovery experiences. It provides standalone, configurable UI components that work independently or together to create a complete search interface.

**Key Facts:**

- **Framework**: Vue 3 with Composition API
- **State Management**: Vuex 4.0.2
- **Type Safety**: Full TypeScript support with `@empathyco/x-types`
- **Testing**: Vitest with component testing
- **Styling**: CSS + TailwindCSS compatible (use with `@empathyco/x-tailwindcss`)
- **Module System**: Feature-based X Modules architecture

## Installation

```bash
npm install @empathyco/x-components vue@^3.5.30 vuex@4.0.2
```

**Required peer dependencies**: `vue` and `vuex`

**Related packages**:

- `@empathyco/x-adapter` - API connection (included as dependency)
- `@empathyco/x-types` - TypeScript types (included as dependency)
- `@empathyco/x-tailwindcss` - Design system plugin (optional)

## Architecture

### X Modules System

Components are organized into **X Modules**, each representing a distinct search feature:

- **search** - Search box, input, buttons
- **query-suggestions** - Autocomplete suggestions
- **popular-searches** - Trending queries
- **recommendations** - Product recommendations
- **facets** - Filters and refinements
- **results** - Search results display
- **next-queries** - Related searches
- **history-queries** - Search history
- **url** - URL state management
- **tagging** - Event tracking
- **identifier-results** - Specific product lookups
- **semantic-queries** - Query understanding

Each module has:

- **Components** - UI elements
- **Store** - Vuex state management
- **Wiring** - Event connections between modules
- **Types** - TypeScript definitions

### Store Architecture

Uses Vuex with modular store structure:

- Each X Module has its own store module
- Global state in root store
- Actions, mutations, getters follow module patterns
- RxJS observables for reactive data streams

### Component Philosophy

- **Standalone**: Each component works independently
- **Composable**: Combine components for richer experiences
- **Configurable**: Props and slots for customization
- **Accessible**: Built with a11y best practices
- **Type-safe**: Full TypeScript support

## Common Usage Patterns

### Basic Setup

```typescript
import { installXPlugin } from '@empathyco/x-components'
import { createApp } from 'vue'
import { createStore } from 'vuex'

const app = createApp(App)
const store = createStore({})

app.use(store)
app.use(installXPlugin, {
  adapter: myAdapter, // From @empathyco/x-adapter
  store,
})

app.mount('#app')
```

### Using Components

```vue
<template>
  <SearchInput />
  <QuerySuggestions />
  <Facets />
  <Results />
</template>

<script setup>
import { Facets, QuerySuggestions, Results, SearchInput } from '@empathyco/x-components'
</script>
```

### Component Customization

**Via Props:**

```vue
<SearchInput :maxLength="100" :autofocus="true" placeholder="Search products..." />
```

**Via Slots:**

```vue
<Results>
  <template #result="{ item }">
    <CustomResultCard :product="item" />
  </template>
</Results>
```

**Via CSS:**

```css
.x-search-input {
  /* Custom styles */
}
```

### State Management

**Access store state:**

```typescript
import { useStore } from 'vuex'

const store = useStore()
const query = store.state.search.query
```

**Dispatch actions:**

```typescript
store.dispatch('search/setQuery', 'shoes')
```

**Use composables:**

```typescript
import { useGetter, useState } from '@empathyco/x-components'

const { query } = useState('search', ['query'])
const { results } = useGetter('search', ['results'])
```

## Key Component Categories

### Search Input

- `SearchInput` - Main search box
- `SearchButton` - Submit button
- `ClearSearchInput` - Clear button
- `SearchInputPlaceholder` - Animated placeholder

### Suggestions & Autocomplete

- `QuerySuggestions` - Search suggestions list
- `QuerySuggestionItem` - Individual suggestion
- `PopularSearches` - Trending queries

### Results Display

- `Results` - Main results container
- `ResultsList` - Results grid/list
- `BaseResultImage` - Product images
- `BaseResultLink` - Result links
- `Pagination` - Page navigation
- `SortDropdown` - Sort options

### Filtering

- `Facets` - Filter container
- `SimpleFacet` - Basic filters
- `HierarchicalFacet` - Nested filters
- `NumberRangeFacet` - Price range sliders
- `EditableNumberRangeFacet` - Manual range input
- `RenderlessFilter` - Headless filter logic

### Recommendations

- `Recommendations` - Product recommendations
- `NextQueries` - Related search suggestions
- `QueryPreview` - Preview results for a query

### History & Personalization

- `HistoryQueries` - Past searches
- `MyHistory` - Personal search history

### Layout & UI

- `SlidingPanel` - Expandable panels
- `BaseModal` - Modal dialogs
- `BaseDropdown` - Dropdown menus
- `BaseGrid` - Grid layouts
- `AnimateWidth`/`AnimateHeight` - Animations

### URL & Navigation

- `UrlHandler` - URL state sync
- `BrowserHistoryManager` - Browser history

## Module-Specific Features

### Search Module

- Query state management
- Search execution
- Debouncing and throttling
- Query history

### Facets Module

- Multi-select filters
- Hierarchical navigation
- Range sliders
- Filter state persistence

### Recommendations Module

- Product recommendations
- Vectorized recommendations
- Query-based recommendations
- Configurable sources

### Tagging Module

- Session tracking
- Event tagging
- Privacy-compliant (no PII)
- Custom event definitions

### URL Module

- URL parameter sync
- Deep linking support
- Browser back/forward handling
- Shareable search states

## Advanced Patterns

### Custom Adapter Integration

```typescript
import { platformAdapter } from '@empathyco/x-adapter-platform'

const adapter = platformAdapter({
  endpoint: 'https://api.yourstore.com/search',
  requestMapper: customRequestMapper,
  responseMapper: customResponseMapper,
})
```

### Event Bus Usage

Components communicate via X Bus (event system):

```typescript
import { XBus } from '@empathyco/x-components'

// Listen to events
XBus.on('UserAcceptedAQuery').subscribe(query => {
  console.log('Query accepted:', query)
})

// Emit events
XBus.emit('UserClickedAResult', result)
```

### Store Extensions

Extend store modules with custom logic:

```typescript
app.use(installXPlugin, {
  store,
  adapter,
  extendStore(store) {
    store.registerModule('custom', customModule)
  },
})
```

### Renderless Components

Use renderless components for logic without UI:

```vue
<RenderlessFilter :filter="filter" v-slot="{ isSelected, toggle }">
  <CustomFilterUI :active="isSelected" @click="toggle" />
</RenderlessFilter>
```

## Composables & Utilities

### State Composables

- `useState` - Access module state
- `useGetter` - Access module getters
- `useDevice` - Detect device type
- `useRegisterXModule` - Register modules dynamically

### Utility Functions

- `createEmptyFacet` - Factory for facets
- `isStringEmpty` - String validation
- `normalizeString` - Text normalization
- `debounce` / `throttle` - Performance utilities

## Configuration

### Plugin Options

```typescript
{
  adapter: ApiAdapter,           // Required: API adapter
  store: Store,                  // Required: Vuex store
  domElement?: string,           // Root element selector
  installXModules?: XModule[],   // Modules to install
  initialXModules?: InitialXModules, // Initial module config
  alias?: Record<string, unknown> // Custom aliases
}
```

### Module Configuration

Each module can be configured during initialization:

```typescript
{
  facets: {
    config: {
      numbersOfFacetsToRequest: 10
    }
  },
  search: {
    config: {
      debounceTimeMs: 300
    }
  }
}
```

## Styling Strategies

### Default Styling

Components include minimal default styles. Import base styles:

```typescript
import '@empathyco/x-components/dist/core/index.css'
```

### Custom CSS

Override with custom CSS classes:

```css
.x-search-input {
  border: 2px solid #007bff;
  border-radius: 8px;
}
```

### TailwindCSS Integration

Use with `@empathyco/x-tailwindcss` for design system:

```typescript
// tailwind.config.js
module.exports = {
  plugins: [
    require('@empathyco/x-tailwindcss')({
      // Design tokens config
    }),
  ],
}
```

### CSS Variables

Components support CSS custom properties for theming:

```css
:root {
  --x-primary-color: #007bff;
  --x-font-family: 'Inter', sans-serif;
}
```

## TypeScript Support

Full type safety with `@empathyco/x-types`:

```typescript
import type { Facet, Filter, Result, SearchRequest, SearchResponse } from '@empathyco/x-types'

function processResults(results: Result[]): void {
  // Fully typed
}
```

## Testing Components

Components are tested with Vitest:

```typescript
import { SearchInput } from '@empathyco/x-components'
import { mount } from '@vue/test-utils'

test('SearchInput renders correctly', () => {
  const wrapper = mount(SearchInput)
  expect(wrapper.exists()).toBe(true)
})
```

## Performance Considerations

- **Code Splitting**: Import only needed modules
- **Lazy Loading**: Use dynamic imports for large components
- **Debouncing**: Search input debounces by default
- **Virtual Scrolling**: For large result lists (not included, use 3rd party)
- **Image Lazy Loading**: Use `loading="lazy"` on images

## Common Patterns & Best Practices

### Progressive Enhancement

Start with basic components, add features incrementally:

```vue
<!-- Basic -->
<SearchInput />
<Results />

<!-- Enhanced -->
<SearchInput :autofocus="true" />
<QuerySuggestions />
<Facets />
<Results>
  <template #result="{ item }">
    <CustomCard :data="item" />
  </template>
</Results>
```

### Error Handling

Components emit error events:

```typescript
XBus.on('SearchRequestError').subscribe(error => {
  console.error('Search failed:', error)
  showErrorNotification(error.message)
})
```

### Accessibility

- Components include ARIA attributes
- Keyboard navigation supported
- Screen reader friendly
- Focus management handled

### Responsive Design

- Mobile-first approach
- Device detection via `useDevice`
- Responsive slots and props

## Migration from Vue 2

X Components 6.x uses Vue 3. Key changes:

- Composition API preferred over Options API
- Vuex 4.x required
- `$listeners` removed (use `v-bind="$attrs"`)
- Teleport instead of Portal

## Documentation Resources

- **Official Docs**: https://docs.empathy.co/develop-empathy-platform/ui-reference/
- **Architecture Guide**: https://docs.empathy.co/develop-empathy-platform/build-search-ui/web-x-architecture/
- **Component Reference**: https://docs.empathy.co/develop-empathy-platform/ui-reference/
- **Integration Guide**: https://docs.empathy.co/develop-empathy-platform/build-search-ui/web-x-components-development-guide.html

## Related Packages in Monorepo

When contributing to x-components, you may need:

- `@empathyco/x-adapter` - For API integration changes
- `@empathyco/x-types` - For type definition updates
- `@empathyco/x-utils` - For shared utility functions
- `@empathyco/x-tailwindcss` - For styling examples

## Common Issues

**Components not rendering**: Ensure plugin is installed and store is configured

**Types not found**: Install `@empathyco/x-types` and check imports

**Adapter errors**: Verify adapter configuration and endpoint URLs

**Style conflicts**: Check CSS specificity and load order

**Store not updating**: Verify Vuex module registration and proper mutations/actions
