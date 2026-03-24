<script lang="ts">
import type { Facet } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { useFacets } from '../../composables/use-facets'
import { facetsXModule } from '../../x-module'

/**
 * Provides a scoped slot with the selected filters from every facet, or from the facet which
 * facet id is passed as property.
 *
 * The default slot renders the length of the selected filters array.
 * The property "alwaysVisible" handles if the component is rendered if no filters are selected.
 *
 * @public
 */
export default defineComponent({
  name: 'SelectedFilters',
  xModule: facetsXModule.name,
  props: {
    /** Array of facets ids used to get the selected filters for those facets. */
    facetsIds: Array as PropType<Array<Facet['id']>>,
    /** Flag to render the component even if there are no filters selected. */
    alwaysVisible: Boolean,
  },
  setup(props, { slots }) {
    const { selectedFilters, isVisible } = useFacets(props)

    return () =>
      isVisible.value
        ? (slots.default?.({ selectedFilters: selectedFilters.value })[0] ??
          h('span', `${selectedFilters.value.length}`))
        : ''
  },
})
</script>

<docs lang="mdx">
## Examples

Provides a scoped slot with the selected filters from every facet, or from the facet which facet id
is passed as property.

The default slot renders the length of the selected filters array.

### Basic usage

```vue
<template>
  <SelectedFilters />
</template>

<script setup>
import { SelectedFilters } from '@empathyco/x-components/facets'
</script>
```

### Always visible

If "alwaysVisible" is true, the component is rendered no matter if there are some filter selected.
If "alwaysVisible" is false (default), the component is rendered if there are some filter selected.

```vue
<template>
  <SelectedFilters alwaysVisible />
</template>

<script setup>
import { SelectedFilters } from '@empathyco/x-components/facets'
</script>
```

Output:

```html
<div class="x-selected-filters">1</div>
```

### Customizing its content

In this example, renders a custom message using the default scoped slot.

```vue
<template>
  <SelectedFilters>
    <template #default="{ selectedFilters }">
      Selected filters: {{ selectedFilters.length }}
    </template>
  </SelectedFilters>
</template>

<script setup>
import { SelectedFilters } from '@empathyco/x-components/facets'
</script>
```

Output:

```html
<div class="x-selected-filters">Selected filters: 1</div>
```

In this example, the selected filters are filtered by the facetsIds property.

```vue
<template>
  <SelectedFilters :facetsIds="['brand_facet']" />
</template>

<script setup>
import { SelectedFilters } from '@empathyco/x-components/facets'
</script>
```

```vue
<template>
  <SelectedFilters :facetsIds="['brand_facet', 'gender_facet']">
    <template #default="{ selectedFilters }">
      Selected filters: {{ selectedFilters.length }}
    </template>
  </SelectedFilters>
</template>

<script setup>
import { SelectedFilters } from '@empathyco/x-components/facets'
</script>
```
</docs>
