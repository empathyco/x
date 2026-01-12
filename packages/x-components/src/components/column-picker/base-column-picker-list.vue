<template>
  <div class="x-column-picker-list xds:button-group" data-test="column-picker-list" role="list">
    <template
      v-for="({ column, cssClasses, events, isSelected }, index) in columnsWithCssClasses"
      :key="column"
    >
      <BaseEventButton
        class="x-column-picker-list__button xds:button"
        :class="[buttonClass, cssClasses]"
        data-test="column-picker-button"
        :aria-pressed="isSelected.toString()"
        :events="events"
        :aria-label="`${column} columns`"
        role="listitem"
      >
        <!--
          @slot Customized Column Picker Button content. Specifying a slot with the column value
          will result in the column using that slot composition to render.
            @binding {number} column - Columns Number to pick.
            @binding {boolean} isSelected - True if the columns number are the chosen value.
        -->
        <slot v-bind="{ column, isSelected }">
          {{ column }}
        </slot>
      </BaseEventButton>

      <!--
          @slot Customized Column Picker divider. Specify an element to act as divider for
          the items in the column picker. Empty by default.
        -->
      <slot v-if="index !== columnsWithCssClasses.length - 1" name="divider"></slot>
    </template>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { VueCSSClasses } from '../../utils/types'
import type { XEventsTypes } from '../../wiring'
import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue'
import { use$x } from '../../composables/use-$x'
import BaseEventButton from '../base-event-button.vue'

interface ColumnPickerItem {
  column: number
  cssClasses: VueCSSClasses
  events: Partial<XEventsTypes>
  isSelected: boolean
}

/**
 * Column picker list component renders a list of buttons to choose the columns number.
 *
 * Additionally, this component exposes the following props to modify the classes of the
 * elements: `buttonClass`.
 *
 * @public
 */
export default defineComponent({
  name: 'BaseColumnPickerList',
  components: { BaseEventButton },
  props: {
    /** An array of numbers that represents the number of columns to render. */
    columns: {
      type: Array as PropType<number[]>,
      required: true,
    },
    /** The value of the selected columns number. */
    modelValue: Number,
    /** Class inherited by each button. */
    buttonClass: String,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
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
     * Maps the column to an object containing: the `column` and `CSS classes`.
     *
     * @returns An array of objects containing the column number and CSS classes.
     */
    const columnsWithCssClasses = computed<ColumnPickerItem[]>(() =>
      props.columns.map(column => ({
        column,
        cssClasses: [
          `x-column-picker-list__button--${column}-cols`,
          { 'xds:selected': selectedColumns.value === column },
        ],
        isSelected: selectedColumns.value === column,
        events: {
          UserClickedColumnPicker: column,
          ColumnsNumberProvided: column,
        },
      })),
    )

    return { columnsWithCssClasses }
  },
})
</script>

<docs lang="mdx">
## Examples

This component renders a list of elements in different slots depending on the columns prop. Each
element will emit the needed events to sync other instances of columns pickers, or grids with the
number of columns that it is being selected when it is clicked.

### Default usage

It is required to send the columns prop.

```vue live
<template>
  <BaseColumnPickerList :columns="columns" />
</template>
<script>
import { BaseColumnPickerList } from '@empathyco/x-components'

export default {
  components: {
    BaseColumnPickerList,
  },
  data() {
    return { columns: [2, 4, 6] }
  },
}
</script>
```

#### Using v-model

It is possible to do two way binding in order to synchronize the value with the parents. It will be
updated if it changed the value or if the parent changes it.

```vue live
<template>
  <BaseColumnPickerList :columns="columns" v-model="selectedColumns" />
</template>
<script>
import { BaseColumnPickerList } from '@empathyco/x-components'

export default {
  components: {
    BaseColumnPickerList,
  },
  data() {
    return { columns: [2, 4, 6], selectedColumns: 4 }
  },
}
</script>
```

### Customized usage

#### Overriding the slots

It is possible to override the column picker button content.

```vue live
<template>
  <BaseColumnPickerList :columns="columns" #default="{ column, isSelected }">
    <span>{{ column }} {{ isSelected ? '🟢' : '' }}</span>
  </BaseColumnPickerList>
</template>
<script>
import { BaseColumnPickerList } from '@empathyco/x-components'

export default {
  components: {
    BaseColumnPickerList,
  },
  data() {
    return { columns: [2, 4, 6] }
  },
}
</script>
```

It is also possible to add a divider element between the column picker buttons by overriding the
`divider` slot.

```vue live
<template>
  <BaseColumnPickerList :columns="columns">
    <template #divider>
      <ChevronRightIcon aria-hidden="true" />
    </template>
  </BaseColumnPickerList>
</template>
<script>
import { BaseColumnPickerList, ChevronRightIcon } from '@empathyco/x-components'

export default {
  components: {
    BaseColumnPickerList,
    ChevronRightIcon,
  },
  data() {
    return { columns: [2, 4, 6] }
  },
}
</script>
```

#### Customizing the buttons with classes

The `buttonClass` prop can be used to add classes to the buttons.

```vue live
<template>
  <BaseColumnPickerList :columns="columns" buttonClass="x-button--round" />
</template>
<script>
import { BaseColumnPickerList } from '@empathyco/x-components'

export default {
  components: {
    BaseColumnPickerList,
  },
  data() {
    return { columns: [2, 4, 6] }
  },
}
</script>
```

## Events

A list of events that the component will emit:

- [`UserClickedColumnPicker`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks an item. The event payload is the number of columns
  that the clicked item represents.
- [`ColumnsNumberProvided`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted on component mount. The event payload is the current `selectedColumns` value.
</docs>
