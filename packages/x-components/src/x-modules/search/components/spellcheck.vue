<template>
  <div v-if="spellcheckedQuery" class="x-spellcheck" data-test="spellcheck">
    <slot v-bind="{ query, spellcheckedQuery }">{{ query }} - {{ spellcheckedQuery }}</slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useState } from '../../../composables/use-state'
import { searchXModule } from '../x-module'

/**
 * The `Spellcheck` component allows to inform the user with a friendly message that he
 * might have misspelled the search query. This message can be set using the default slot
 * of the component, which gives access to the searched query using the `query` scope property,
 * and the spellchecked query proposal, using the `spellcheckedQuery` scope property.
 *
 * The component will only render itself if the `spellcheckedQuery` property has value.
 *
 * @public
 */
export default defineComponent({
  name: 'Spellcheck',
  xModule: searchXModule.name,
  setup() {
    /**
     * The query and the spellcheckedQuery from the search state.
     *
     * @public
     */
    const { query, spellcheckedQuery } = useState('search')

    return {
      query,
      spellcheckedQuery,
    }
  },
})
</script>

<docs lang="mdx">
## Examples

This default spellcheck component expects a query and a spellcheckedQuery to render and pass to its
default slot.

This two props should be show like a message comparing them.

### Basic usage

```vue
<template>
  <Spellcheck />
</template>

<script setup>
import { Spellcheck } from '@empathyco/x-components/search'
</script>
```

### Customizing its contents

```vue
<template>
  <Spellcheck>
    <template #default="{ query, spellcheckedQuery }">
      No results found for '{{ query }}'. We show you results for '{{ spellcheckedQuery }}'
    </template>
  </Spellcheck>
</template>

<script setup>
import { Spellcheck } from '@empathyco/x-components/search'
</script>
```
</docs>
