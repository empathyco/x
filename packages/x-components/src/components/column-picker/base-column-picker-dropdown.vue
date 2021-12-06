<template>
  <BaseDropdown
    @change="emitEvent"
    :value="selectedColumns"
    :items="columns"
    :animation="animation"
  >
    <template v-if="$scopedSlots.toggle" #toggle="{ item, isOpen }">
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
  import { Component, Prop } from 'vue-property-decorator';
  import { mixins } from 'vue-class-component';
  import Vue from 'vue';
  import BaseEventButton from '../base-event-button.vue';
  import BaseDropdown from '../base-dropdown.vue';
  import ColumnPickerMixin from './column-picker.mixin';

  /**
   * Column picker dropdown component renders {@link BaseDropdown | dropdown} component which
   * options are the different columns you can set for a grid.
   *
   * It emits {@link XEventsTypes.UserClickedColumnPicker | UserClickedColumnPicker} on dropdown
   * input.
   *
   * @remarks It extends {@link ColumnPickerMixin}.
   *
   * @public
   */
  @Component({
    components: { BaseDropdown, BaseEventButton }
  })
  export default class BaseColumnPickerDropdown extends mixins(ColumnPickerMixin) {
    /**
     * The transition to use for opening and closing the dropdown.
     *
     * @public
     */
    @Prop()
    public animation?: string | typeof Vue;

    /**
     * Emits a {@link XEventsTypes.UserClickedColumnPicker | UserClickedColumnPicker} and
     * {@link XEventsTypes.ColumnsNumberProvided | ColumnsNumberProvided} events.
     *
     * @param column - Column number payload.
     */
    emitEvent(column: number): void {
      this.$x.emit('UserClickedColumnPicker', column);
      this.$x.emit('ColumnsNumberProvided', column);
    }
  }
</script>

<docs lang="mdx">
## Example

Column picker dropdown component renders a dropdown component which options are the different
columns you can set for a grid.

### Usage

Notice that the slots provided match with the `BaseDropdown` component. The `item` slot is required
unlike the `toggle`, which renders the same `item` slot defined by default.

#### Default usage

```vue
<template>
  <BaseColumnPickerDropdown v-model="selectedColumns" :columns="[2, 4, 6]">
    <template #item="{ item, isSelected, isHighlighted }">
      <span v-if="isHighlighted">🟢</span>
      <span v-if="isSelected">✅</span>
      <span>{{ item }}</span>
    </template>
  </BaseColumnPickerDropdown>
</template>

<script>
  import { BaseColumnPickerDropdown } from '@empathyco/x-components';

  export default {
    name: 'BaseColumnPickerDropdownTest',
    components: {
      BaseColumnPickerDropdown
    },
    data() {
      return {
        selectedColumns: 2
      };
    }
  };
</script>
```

#### Customizing toggle button

```vue
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

<script>
  import { BaseColumnPickerDropdown } from '@empathyco/x-components';

  export default {
    name: 'BaseColumnPickerDropdownTest',
    components: {
      BaseColumnPickerDropdown
    },
    data() {
      return {
        selectedColumns: 2
      };
    }
  };
</script>
```

#### Using it without v-model / value

The component emits an X Event, `UserClickedColumnPicker`, on column change and it also listens to
that event from outside, so you don't need to store the current column value to keep it synchronized
with other column pickers.

```vue
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

<script>
  import { BaseColumnPickerDropdown } from '@empathyco/x-components';

  export default {
    name: 'BaseColumnPickerDropdownTest',
    components: {
      BaseColumnPickerDropdown
    }
  };
</script>
```

## Events

An event that the component will emit:

- `UserClickedColumnPicker`: the event is emitted after the user clicks an item in the dropdown. The
  event payload is the number of columns that the clicked item represents.
- `ColumnsNumberProvided`: the event is emitted on component mount, and whenever the value changes.
  The event payload is the current `selectedColumns` value.
</docs>
