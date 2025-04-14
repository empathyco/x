<template>
  <component
    :is="animation"
    v-if="items.length"
    tag="ul"
    class="x-items-list"
    data-test="items-list"
  >
    <li
      v-for="item in computedItems"
      :key="item.id"
      class="x-items-list__item"
      :class="item.class"
      :data-test="item.dataTest"
    >
      <!--
        @slot Custom item to render.
          @binding {ListItem} item - Item data.
      -->
      <slot :item="item" :name="item.slotName">{{ item.id }}</slot>
    </li>
  </component>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { ListItem } from '../utils/types'
import { computed, defineComponent } from 'vue'
import { AnimationProp } from '../types'
import { toKebabCase } from '../utils/string'

/**
 * It renders a list of {@link ListItem} providing a slot for each `slotName` which depends on
 * the `modelName`of the item.
 *
 * @public
 */
export default defineComponent({
  name: 'ItemsList',
  props: {
    /** Animation component that will be used to animate the list. */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
    /** List of items. */
    items: {
      type: Array as PropType<ListItem[]>,
      required: true,
    },
    /** Item's classes. */
    itemClass: String,
  },
  setup(props) {
    /**
     * The list of the items with additional properties.
     *
     * @returns A list of items with `dataTest`, `class` and the `slotName` for each item.
     */
    const computedItems = computed(() =>
      props.items.map(item => {
        const modelName = toKebabCase(item.modelName)
        return {
          ...item,
          dataTest: `${modelName}s-list-item`,
          class: [`x-${modelName}s-list-item`, props.itemClass],
          slotName: modelName,
        }
      }),
    )

    return { computedItems }
  },
})
</script>
