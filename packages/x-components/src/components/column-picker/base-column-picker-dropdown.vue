<template>
  <BaseDropdown
    :model-value="selectedColumns"
    :items="columns"
    :animation="animation"
    aria-label="Select number of columns"
    @update:model-value="emitEvents"
  >
    <template v-if="hasToggleSlot" #toggle="{ item, isOpen }">
      <!--
       @slot From `BaseDropdown` component: Used to render the contents of the dropdown toggle
       button. If not provided, it uses the `item` slot as fallback.
       @binding {string|number|Identifiable} item - The item data to render.
       @binding {boolean} isOpen - True if the dropdown is opened, and false if it is
       closed.
      -->
      <slot name="toggle" v-bind="{ item, isOpen }" />
    </template>
    <template #item="{ item, isSelected, isHighlighted }">
      <!--
       @slot (required) From `BaseDropdown` component: Used to render each one of the items
       content, and as fallback for the toggle button content slot if it is not provided.
       @binding {string|number|Identifiable} item - Item to render
       @binding {boolean} isHighlighted - True when the item has the focus.
       @binding {boolean} isSelected - True when the item is selected.
      -->
      <slot name="item" v-bind="{ item, isSelected, isHighlighted }" />
    </template>
  </BaseDropdown>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type Vue from 'vue'
import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue'
import { use$x } from '../../composables/use-$x'
import BaseDropdown from '../base-dropdown.vue'

/**
 * Column picker dropdown component renders {@link BaseDropdown} component which
 * options are the different columns you can set for a grid.
 *
 * It emits {@link XEventsTypes.UserClickedColumnPicker} on dropdown
 * input.
 *
 * @public
 */
export default defineComponent({
  name: 'BaseColumnPickerDropdown',
  components: { BaseDropdown },
  props: {
    /** An array of numbers that represents the number of columns to render. */
    columns: {
      type: Array as PropType<number[]>,
      required: true,
    },
    /** The value of the selected columns number. */
    modelValue: Number,
    /** The transition to use for opening and closing the dropdown. */
    animation: [String, Object] as PropType<string | typeof Vue>,
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const $x = use$x()

    const providedSelectedColumns = computed(() => props.modelValue ?? props.columns[0])
    const selectedColumns = ref(providedSelectedColumns.value)

    /**
     * Assigns `selectedColumns` value and emits `ColumnsNumberProvided`.
     *
     * @param column - Column number provided.
     */
    function emitColumnsNumberProvided(column: number) {
      selectedColumns.value = column
      $x.emit('ColumnsNumberProvided', column)
    }

    /**
     * Emits `update:modelValue` with the column selected.
     *
     * @param column - Column number selected.
     */
    function emitUpdateModelValue(column: number) {
      if (props.modelValue !== column) {
        emit('update:modelValue', column)
      }
    }

    watch(providedSelectedColumns, emitColumnsNumberProvided)
    watch(selectedColumns, emitUpdateModelValue)

    $x.on('ColumnsNumberProvided', false).subscribe(column => (selectedColumns.value = column))

    /**
     * Synchronizes the columns number before mounting the component. If the real number of selected
     * columns equals the provided columns, it emits the event to sync it with every other component.
     * If it is not equal it means that the user has already selected a number of columns, so we emit
     * a `update:modelValue` event so developers can sync the provided value.
     */
    onBeforeMount(() => {
      if (selectedColumns.value === providedSelectedColumns.value) {
        emitColumnsNumberProvided(selectedColumns.value)
      } else {
        emitUpdateModelValue(selectedColumns.value)
      }
    })

    /**
     * Emits a {@link XEventsTypes.UserClickedColumnPicker} and
     * {@link XEventsTypes.ColumnsNumberProvided} events.
     *
     * @param column - Column number payload.
     */
    function emitEvents(column: number) {
      $x.emit('UserClickedColumnPicker', column)
      $x.emit('ColumnsNumberProvided', column)
    }

    return {
      emitEvents,
      hasToggleSlot: !!slots.toggle,
      selectedColumns,
    }
  },
})
</script>

<docs lang="mdx">
## Events

An event that the component will emit:

- [`UserClickedColumnPicker`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks an item in the dropdown. The event payload is the
  number of columns that the clicked item represents.
- [`ColumnsNumberProvided`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted on component mount, and whenever the value changes. The event payload is the
  current `selectedColumns` value.

## Examples

Column picker dropdown component renders a dropdown component which options are the different
columns you can set for a grid.

### Usage

Notice that the slots provided match with the `BaseDropdown` component. The `item` slot is required
unlike the `toggle`, which renders the same `item` slot defined by default.

#### Default usage

```vue live
<template>
  <BaseColumnPickerDropdown v-model="selectedColumns" :columns="[2, 4, 6]">
    <template #item="{ item, isSelected, isHighlighted }">
      <span v-if="isHighlighted">🟢</span>
      <span v-if="isSelected">✅</span>
      <span>{{ item }}</span>
    </template>
  </BaseColumnPickerDropdown>
</template>

<script setup>
import { ref } from 'vue'
import BaseColumnPickerDropdown from '@empathyco/x-components/js/components/column-picker/base-column-picker-dropdown.vue'

const selectedColumns = ref(2)
</script>
```

#### Customizing toggle button

```vue live
<template>
  <BaseColumnPickerDropdown v-model="selectedColumns" :columns="[2, 4, 6]">
    <template #toggle="{ item, isOpen }">Selected: {{ item }} {{ isOpen ? '🔼' : '🔽' }}️</template>
    <template #item="{ item, isSelected, isHighlighted }">
      <span v-if="isHighlighted">🟢</span>
      <span v-if="isSelected">✅</span>
      <span>{{ item }}</span>
    </template>
  </BaseColumnPickerDropdown>
</template>

<script setup>
import { ref } from 'vue'
import BaseColumnPickerDropdown from '@empathyco/x-components/js/components/column-picker/base-column-picker-dropdown.vue'

const selectedColumns = ref(2)
</script>
```

#### Using it without v-model / value

The component emits an X Event, `UserClickedColumnPicker`, on column change and it also listens to
that event from outside, so you don't need to store the current column value to keep it synchronized
with other column pickers.

```vue live
<template>
  <BaseColumnPickerDropdown :columns="[2, 4, 6]">
    <template #toggle="{ item, isOpen }">Selected: {{ item }} {{ isOpen ? '🔼' : '🔽' }}️</template>
    <template #item="{ item, isSelected, isHighlighted }">
      <span v-if="isHighlighted">🟢</span>
      <span v-if="isSelected">✅</span>
      <span>{{ item }}</span>
    </template>
  </BaseColumnPickerDropdown>
</template>

<script setup>
import BaseColumnPickerDropdown from '@empathyco/x-components/js/components/column-picker/base-column-picker-dropdown.vue'
</script>
```
</docs>
