<template>
  <component
    :is="animation"
    tag="div"
    class="x-sort-picker-list"
    data-test="sort-picker"
    role="list"
  >
    <BaseEventButton
      v-for="{ item, cssClasses, event } in listItems"
      :key="item"
      :class="[cssClasses, buttonClass]"
      data-test="sort-picker-button"
      :events="event"
      :aria-pressed="item === selectedSort || null"
      role="listitem"
    >
      <slot v-bind="{ item, isSelected: item === selectedSort }">
        {{ item }}
      </slot>
    </BaseEventButton>
  </component>
</template>

<script lang="ts">
import type { Sort } from '@empathyco/x-types'
import type { PropType } from 'vue'
import type Vue from 'vue'
import type { VueCSSClasses } from '../../../utils/index'
import type { XEventsTypes } from '../../../wiring/index'
import { computed, defineComponent, watch } from 'vue'
import BaseEventButton from '../../../components/base-event-button.vue'
import { use$x, useState } from '../../../composables/index'
import { browseXModule } from '../x-module'

/**
 * Sort Picker item options.
 */
interface SortPickerItem {
  item: Sort
  cssClasses: VueCSSClasses
  event: Partial<XEventsTypes>
}

/**
 * The `SortPickerList` component allows user to select the search results order. This component
 * also allows to change the selected sort programmatically.
 */
export default defineComponent({
  name: 'BrowseSortPickerList',
  xModule: browseXModule.name,
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
      default: () => 'div',
    },
    /** Class inherited by each sort button. */
    buttonClass: String,
  },
  setup(props) {
    const $x = use$x()

    const { sort: selectedSort } = useState('browse')

    watch(selectedSort, (value: Sort) => $x.emit('SelectedBrowseSortProvided', value), {
      immediate: true,
    })

    /**
     * Sort list items.
     *
     * @returns A list of items with their css class and the event associate to it.
     */
    const listItems = computed<SortPickerItem[]>(() =>
      props.items.map(item => ({
        item,
        cssClasses: {
          'x-selected': item === selectedSort.value,
        },
        event: { UserClickedABrowseSort: item },
      })),
    )

    return {
      listItems,
      selectedSort,
    }
  },
})
</script>
