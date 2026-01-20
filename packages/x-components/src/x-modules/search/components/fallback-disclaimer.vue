<template>
  <div
    v-if="fromNoResultsWithFilters"
    class="x-fallback-disclaimer"
    data-test="fallback-disclaimer"
  >
    <slot v-bind="{ query }">
      No results found for {{ query }} with the selected filters. The filters have been unselected.
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useState } from '../../../composables/use-state'
import { searchXModule } from '../x-module'

/**
 * The `FallbackDisclaimer` component shows a message if the filters have been removed
 * from the current search because there were no results.
 *
 * @public
 */
export default defineComponent({
  name: 'FallbackDisclaimer',
  xModule: searchXModule.name,
  setup() {
    const { query, fromNoResultsWithFilters } = useState('search')

    return { query, fromNoResultsWithFilters }
  },
})
</script>

<docs lang="mdx">
## Examples

This default fallback disclaimer component reads the query from the search state and passes it to
its default slot. This component will be rendered if there is a no results with filters situation.

### Basic usage

```vue
<template>
  <FallbackDisclaimer />
</template>

<script setup>
import { FallbackDisclaimer } from '@empathyco/x-components/search'
</script>
```

### Customizing its contents

```vue
<template>
  <FallbackDisclaimer>
    <template #default="{ query }">
      No results found for '{{ query }}' with the selected filters. The filters have been
      unselected.
    </template>
  </FallbackDisclaimer>
</template>

<script setup>
import { FallbackDisclaimer } from '@empathyco/x-components/search'
</script>
```
</docs>
