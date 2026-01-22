<template>
  <BaseDropdown
    ref="rootRef"
    :items="items"
    :model-value="selectedSort"
    :animation="animation"
    class="x-sort-dropdown"
    data-test="sort-dropdown"
    aria-label="Select sorting"
    @update:model-value="emitUserClickedASort"
  >
    <template #toggle="{ isOpen, item }">
      <!--
       @slot Used to render the contents of the dropdown toggle button. If not provided, it uses
       the item slot as fallback.
       @binding {Sort} item - The sort data to render.
       @binding {boolean} isOpen - True if the dropdown is opened, and false if it is closed.
      -->
      <slot v-bind="{ isOpen, item }" name="toggle">{{ item }}</slot>
    </template>
    <template #item="{ item, isHighlighted, isSelected }">
      <!--
        @slot (required) Used to render each one of the items content, and as fallback
        for the toggle button content slot if it is not provided.
        @binding {Sort} item - Sort to render
        @binding {boolean} isHighlighted - True when the item has the focus.
        @binding {boolean} isSelected - True when the item is selected.
      -->
      <slot v-bind="{ item, isHighlighted, isSelected }" name="item">{{ item }}</slot>
    </template>
  </BaseDropdown>
</template>

<script lang="ts">
import type { Sort } from '@empathyco/x-types'
import type { PropType } from 'vue'
import type Vue from 'vue'
import { defineComponent, ref, watch } from 'vue'

import BaseDropdown from '../../../components/base-dropdown.vue'
import { use$x } from '../../../composables/use-$x'
import { useState } from '../../../composables/use-state'
import { searchXModule } from '../x-module'

/**
 * The `SortDropdown` component allows user to select the search results order. This component
 * also allows to change the selected sort programmatically.
 */
export default defineComponent({
  name: 'SortDropdown',
  xModule: searchXModule.name,
  components: { BaseDropdown },
  props: {
    /** The list of possible sort values. */
    items: {
      type: Array as PropType<Sort[]>,
      required: true,
    },
    /** The transition to use for opening and closing the dropdown. */
    animation: [String, Object] as PropType<string | typeof Vue>,
  },
  emits: ['change'],
  setup(_, { emit }) {
    const $x = use$x()

    const { sort: selectedSort } = useState('search')
    const rootRef = ref<typeof BaseDropdown>()

    watch(selectedSort, (value: Sort) => $x.emit('SelectedSortProvided', value), {
      immediate: true,
    })

    /**
     * Emits the events related to the selection of a sort value.
     *
     * @remarks `(rootRef.value as any)?.$el` because rollup-plugin-vue understands
     * `ref<typeof BaseDropdown>` as VueConstructor which doesn't contain $el.
     *
     * @param sort - The selected sort.
     */
    function emitUserClickedASort(sort: Sort) {
      $x.emit('UserClickedASort', sort, { target: (rootRef.value as any)?.$el })
      emit('change', sort)
    }

    return {
      emitUserClickedASort,
      rootRef,
      selectedSort,
    }
  },
})
</script>

<docs lang="mdx">
## Sort Dropdown

The `SortDropdown` component can be used to change the way the search results are ordered.

To do so, the list of valid sort values has to be provided using the `items` prop. These are the
values that can be received then in the `SearchAdapter`.

The component also optionally accepts the selected sort, which can be set using the `v-model` prop.
This prop allows changing programmatically the selected sort, as it will be synced with the store
immediately. If this prop is not provided, the first item from the `items` prop will be the one
selected by default.

This component also allows customizing both the toggle button and each one of the possible sort
values. This can be done with the `toggle` and `item` slots.

## Events

This component emits 2 different events:

- [`SelectedSortProvided`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  To sync the selected sort with the store state value. This event is emitted as soon as the list of
  items is received, whenever this list changes if there is no provided value, and when the provided
  value changes.
- [`UserClickedASort`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  As its name suggests, the event is emitted after the user clicks one of the sort options. This does
  not mean that the sort has changed, only that the user has clicked it.

## Examples

### Only providing the list of items

```vue
<template>
  <SortDropdown :items="sortValues">
    <template #toggle="{ item, isOpen }">{{ item }} {{ isOpen ? '🔼' : '🔽' }}</template>
    <template #item="{ item, isHighlighted, isSelected }">
      <span v-if="isSelected">✅</span>
      <span v-if="isHighlighted">🟢</span>
      {{ item }}
    </template>
  </SortDropdown>
</template>

<script setup>
import { SortDropdown } from '@empathyco/x-components/search'
import { ref } from 'vue'

const sortValues = ref(['Relevance', 'Price asc', 'Price desc'])
</script>
```

### Providing also the selected value

```vue
<template>
  <SortDropdown v-model="selectedSort" :items="sortValues">
    <template #toggle="{ item, isOpen }">{{ item }} {{ isOpen ? '🔼' : '🔽' }}</template>
    <template #item="{ item, isHighlighted, isSelected }">
      <span v-if="isSelected">✅</span>
      <span v-if="isHighlighted">🟢</span>
      {{ item }}
    </template>
  </SortDropdown>
</template>

<script setup>
import { SortDropdown } from '@empathyco/x-components/search'
import { ref } from 'vue'

const selectedSort = ref('Price asc')
const sortValues = ref(['Relevance', 'Price asc', 'Price desc'])
</script>
```
</docs>
