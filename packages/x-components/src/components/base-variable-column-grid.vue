<template>
  <BaseGrid :animation="animation" :columns="columnsToRender" :items="items">
    <template v-for="(_, name) in slots" #[name]="{ item }">
      <!--
        @slot Customized item rendering. The slot name can either be default or the item's model
         name.
            @binding {GridItem} item - Item to render.
      -->
      <slot :name="name" v-bind="{ item }" />
    </template>
  </BaseGrid>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { ListItem } from '../utils/types'
import { computed, defineComponent, ref } from 'vue'
import { useXBus } from '../composables/use-x-bus'
import { AnimationProp } from '../types/animation-prop'
import BaseGrid from './base-grid.vue'

/**
 * The `BaseVariableColumnGrid` component is a wrapper of the `BaseGrid` component that listens to
 * the `UserClickedColumnPicker` and the `ColumnsNumberProvided` events and passes the
 * selected number of columns to the grid. It also allows to customize the grid items using the
 * available `scopedSlots`.
 *
 * @public
 */
export default defineComponent({
  name: 'BaseVariableColumnGrid',
  components: {
    BaseGrid,
  },
  props: {
    /**
     * Animation component that will be used to animate the grid.
     *
     * @public
     */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
    /**
     * The list of items to be rendered.
     *
     * @remarks The items must have an id property.
     *
     * @public
     */
    items: Array as PropType<ListItem[]>,
    /**
     * The columns to render by default in the grid. This property is used when the user has not
     * selected any value in the column picker.
     *
     * @internal
     */
    columns: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { slots }) {
    const bus = useXBus()
    /**
     * The number of columns provided by a user interaction.
     *
     * @internal
     */
    const providedColumns = ref<number | null>(null)

    /**
     * The number of columns to render in the grid.
     *
     * @returns The number of columns.
     *
     * @internal
     */
    const columnsToRender = computed(() =>
      providedColumns.value === null ? props.columns : providedColumns.value,
    )

    /**
     * Handler to update the number of columns when the user selects a new value.
     *
     * @param newColumns - The new columns value.
     *
     * @internal
     */
    bus
      .on('ColumnsNumberProvided', false)
      .subscribe(newColumns => (providedColumns.value = newColumns))

    return {
      columnsToRender,
      slots,
    }
  },
})
</script>

<docs lang="mdx">
## Examples

The `BaseVariableColumnGrid` component is a wrapper of the `BaseGrid` component that listens to the
`ColumnsNumberProvided` events and passes the selected amount of columns to the grid. It also allows
you to customize the grid items using the available slots.

### Basic example

```vue
<template>
  <section class="results">
    <button @click="setColumns(4)" class="column-picker-selector">
      <span class="column-picker-selector__text">4 columns</span>
    </button>
    <BaseVariableColumnGrid :animation="animation" :items="items">
      <template #default="{ item }">
        <span data-test="default-slot">{{ item.id }}</span>
      </template>
      <template #result="{ item }">
        <span data-test="result-slot">{{ 'Result ' + item.id }}</span>
      </template>
    </BaseVariableColumnGrid>
  </section>
</template>

<script setup>
import { BaseVariableColumnGrid, StaggeredFadeAndSlide } from '@empathyco/x-components'
import { ref } from 'vue'
const animation = StaggeredFadeAndSlide
const items = [
  { id: 'res-1', modelName: 'Result', name: 'Product 1' },
  { id: 'res-2', modelName: 'Result', name: 'Product 2' },
]
function setColumns(columns) {
  // Emits the event to change columns
  // $x.emit('UserClickedColumnPicker', columns)
}
</script>
```

### Playing with props

Configuring the default columns to be rendered. These columns will be the default value until the
`ColumnsNumberProvided` is emitted and changes the value.

```vue
<template>
  <section class="results">
    <button @click="setColumns(5)" class="column-picker-selector">
      <span class="column-picker-selector__text">5 columns</span>
    </button>
    <BaseVariableColumnGrid :animation="animation" :items="items" :columns="3">
      <template #default="{ item }">
        <span data-test="default-slot">{{ item.id }}</span>
      </template>
      <template #result="{ item }">
        <span data-test="result-slot">{{ 'Result ' + item.id }}</span>
      </template>
    </BaseVariableColumnGrid>
  </section>
</template>

<script setup>
import { BaseVariableColumnGrid, StaggeredFadeAndSlide } from '@empathyco/x-components'
import { ref } from 'vue'
const animation = StaggeredFadeAndSlide
const items = [
  { id: 'res-1', modelName: 'Result', name: 'Product 1' },
  { id: 'res-2', modelName: 'Result', name: 'Product 2' },
]
function setColumns(columns) {
  // Emits the event to change columns
  // $x.emit('UserClickedColumnPicker', columns)
}
</script>
```

### Customizing the items width

The `--x-size-min-width-grid-item` variable can be used to customize the min width of the grid
items.

```vue
<template>
  <BaseVariableColumnGrid
    :animation="animation"
    :items="items"
    style="--x-size-min-width-grid-item: 150px"
  >
    <template #default="{ item }">
      {{ `Default slot content: ${item.id}` }}
    </template>
  </BaseVariableColumnGrid>
</template>

<script setup>
import { BaseVariableColumnGrid, StaggeredFadeAndSlide } from '@empathyco/x-components'
import { ref } from 'vue'
const animation = StaggeredFadeAndSlide
const items = [
  { id: 'res-1', modelName: 'Result', name: 'Product 1' },
  { id: 'res-2', modelName: 'Result', name: 'Product 2' },
]
</script>
```
</docs>
