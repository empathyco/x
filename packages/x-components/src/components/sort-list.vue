<template>
  <component :is="animation" tag="ul" class="x-option-list x-sort-list" data-test="sort-list">
    <li
      v-for="{ item, cssClasses, event } in listItems"
      :key="item"
      :class="cssClasses"
      class="x-option-list__item x-sort-list__item"
    >
      <BaseEventButton
        class="x-sort-list__button xds:button"
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
import type { VueCSSClasses } from '@x/utils/index'
import type { XEvent, XEventsTypes } from '@x/wiring/index'
import type { Component, ComputedRef, PropType } from 'vue'
import BaseEventButton from '@x/components/base-event-button.vue'
import { use$x, useState } from '@x/composables/index'
import { computed, defineComponent, watch } from 'vue'

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
  name: 'SortPickerList',
  components: { BaseEventButton },
  props: {
    animation: {
      type: [String, Object] as PropType<string | Component>,
      default: 'ul',
    },
    items: {
      type: Array as PropType<Sort[]>,
      required: true,
    },
    module: {
      type: String as PropType<'browse' | 'search'>,
      default: 'search',
    },
    selectedSortEvent: {
      type: String as PropType<XEvent>,
      default: 'SelectedSortProvided',
    },
    clickedSortEvent: {
      type: String as PropType<XEvent>,
      default: 'UserClickedASort',
    },
  },
  setup(props) {
    const $x = use$x()

    const { sort: selectedSort }: { sort: ComputedRef<string> } = useState(props.module)

    watch(selectedSort, (value: Sort) => $x.emit(props.selectedSortEvent, value), {
      immediate: true,
    })

    /**
     * Sort list items.
     *
     * @returns A list of items with their css class and the event associate to it.
     */
    const listItems = computed<SortListItem[]>(() =>
      props.items.map((item: string) => ({
        item,
        cssClasses: {
          'x-sort-list__item--is-selected': item === selectedSort.value,
          'x-option-list__item--is-selected': item === selectedSort.value,
        },
        event: { [props.clickedSortEvent]: item },
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
