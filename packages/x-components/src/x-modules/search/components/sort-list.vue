<template>
  <component :is="animation" tag="ul" class="x-option-list x-sort-list" data-test="sort-list">
    <li
      v-for="{ item, cssClasses, event } in listItems"
      :key="item"
      :class="cssClasses"
      class="x-option-list__item x-sort-list__item"
    >
      <BaseEventButton
        class="x-sort-list__button x-button"
        data-test="x-sort-button"
        :events="event"
      >
        <slot v-bind="{ item, isSelected: item === selectedSort }">
          {{ item }}
        </slot>
      </BaseEventButton>
    </li>
  </component>
</template>

<script lang="ts">
import type { Sort } from '@empathyco/x-types'
import type { PropType } from 'vue'
import type Vue from 'vue'
import type { VueCSSClasses } from '../../../utils/types'
import type { XEventsTypes } from '../../../wiring/events.types'
import { computed, defineComponent, watch } from 'vue'
import BaseEventButton from '../../../components/base-event-button.vue'
import { use$x } from '../../../composables/use-$x'
import { useState } from '../../../composables/use-state'
import { searchXModule } from '../x-module'

/**
 * Sort list item options.
 */
interface SortListItem {
  item: Sort
  cssClasses: VueCSSClasses
  event: Partial<XEventsTypes>
}

/**
 * The `SortList` component allows user to select the search results order. This component
 * also allows to change the selected sort programmatically.
 */
export default defineComponent({
  name: 'SortList',
  xModule: searchXModule.name,
  components: { BaseEventButton },
  props: {
    /** The list of possible sort values. */
    items: {
      type: Array as PropType<Sort[]>,
      required: true,
    },
    /** The transition to use for rendering the list. */
    animation: {
      type: [String, Object] as PropType<string | typeof Vue>,
      default: () => 'ul',
    },
  },
  setup(props) {
    const $x = use$x()

    const { sort: selectedSort } = useState('search')

    watch(selectedSort, (value: Sort) => $x.emit('SelectedSortProvided', value), {
      immediate: true,
    })

    /**
     * Sort list items.
     *
     * @returns A list of items with their css class and the event associate to it.
     */
    const listItems = computed<SortListItem[]>(() =>
      props.items.map(item => ({
        item,
        cssClasses: {
          'x-sort-list__item--is-selected': item === selectedSort.value,
          'x-option-list__item--is-selected': item === selectedSort.value,
        },
        event: { UserClickedASort: item },
      })),
    )

    return {
      listItems,
      selectedSort,
    }
  },
})
</script>

<style lang="css" scoped>
.x-sort-list {
  list-style-type: none;
}
</style>

<docs lang="mdx">
## Sort List

The `SortList` component can be used to change the way the search results are ordered.

To do so, the list of valid sort values has to be provided using the `items` prop. These are the
values that can then be received in the `SearchAdapter`.

The component also optionally accepts the selected sort, which can be set using the `v-model` prop.
This prop allows changing programmatically the selected sort, as it will be synced with the store
immediately. If this prop is not provided, the first item from the `items` prop will be the one
selected by default.

This component also allows customizing each one of the possible sort values. This can be done with
the default slot.

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
  <SortList :items="sortValues">
    <template #default="{ item, isSelected }">Item: {{ item }}</template>
  </SortList>
</template>

<script setup>
import { SortList } from '@empathyco/x-components/search'
import { ref } from 'vue'

const sortValues = ref(['Relevance', 'Price asc', 'Price desc'])
</script>
```

### Providing also the selected value

```vue
<template>
  <SortList v-model="selectedSort" :items="sortValues">
    <template #default="{ item, isSelected }">
      <span v-if="isSelected">✅</span>
      {{ item }}
    </template>
  </SortList>
</template>

<script setup>
import { SortList } from '@empathyco/x-components/search'
import { ref } from 'vue'

const selectedSort = ref('Price asc')
const sortValues = ref(['Relevance', 'Price asc', 'Price desc'])
</script>
```
</docs>
