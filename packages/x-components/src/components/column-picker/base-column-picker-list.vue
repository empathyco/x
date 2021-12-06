<template>
  <ul class="x-option-list x-column-picker-list" data-test="column-picker-list">
    <li
      v-for="{ column, cssClasses, events, isSelected } in columnsWithCssClasses"
      :key="column"
      :class="cssClasses"
      class="x-option-list__item x-column-picker-list__item"
      data-test="column-picker-item"
    >
      <BaseEventButton
        class="x-button column-picker-item__button"
        data-test="column-picker-button"
        :aria-selected="isSelected.toString()"
        :events="events"
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
    </li>
  </ul>
</template>

<style lang="scss" scoped>
  .x-column-picker-list {
    display: flex;
    list-style-type: none;
  }
</style>

<script lang="ts">
  import { mixins } from 'vue-class-component';
  import { Component } from 'vue-property-decorator';
  import { VueCSSClasses } from '../../utils/types';
  import { XEventsTypes } from '../../wiring';
  import BaseEventButton from '../base-event-button.vue';
  import ColumnPickerMixin from './column-picker.mixin';

  interface ColumnPickerItem {
    column: number;
    cssClasses: VueCSSClasses;
    events: Partial<XEventsTypes>;
    isSelected: boolean;
  }

  /**
   * Column picker list component renders a list of buttons to choose the columns number.
   *
   * @remarks It extends {@link ColumnPickerMixin}.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton }
  })
  export default class BaseColumnPickerList extends mixins(ColumnPickerMixin) {
    /**
     * Maps the column to an object containing: the `column` and `CSS classes`.
     *
     * @returns An array of objects containing the column number and CSS classes.
     *
     * @internal
     */
    protected get columnsWithCssClasses(): ColumnPickerItem[] {
      return this.columns.map(column => ({
        column,
        cssClasses: [
          `x-column-picker-list__item--${column}-cols`,
          {
            'x-column-picker-list__item--is-selected': this.selectedColumns === column,
            'x-option-list__item--is-selected': this.selectedColumns === column
          }
        ],
        isSelected: this.selectedColumns === column,
        events: {
          UserClickedColumnPicker: column,
          ColumnsNumberProvided: column
        }
      }));
    }
  }
</script>

<docs lang="mdx">
## Examples

This component renders a list of elements in different slots depending on the columns prop. Each
element will emit the needed events to sync other instances of columns pickers, or grids with the
number of columns that it is being selected when it is clicked.

### Default usage

It is required to send the columns prop.

```vue
<template>
  <BaseColumnPickerList :columns="columns" />
</template>
<script>
  import { BaseColumnPickerList } from '@empathyco/xcomponents';

  export default {
    components: {
      BaseColumnPickerList
    },
    data() {
      return { columns: [2, 4, 6] };
    }
  };
</script>
```

#### Using v-model

It is possible to do two way binding in order to synchronize the value with the parents. It will be
updated if it changed the value or if the parent changes it.

```vue
<template>
  <BaseColumnPickerList :columns="columns" v-model="selectedColumns" />
</template>
<script>
  import { BaseColumnPickerList } from '@empathyco/xcomponents';

  export default {
    components: {
      BaseColumnPickerList
    },
    data() {
      return { columns: [2, 4, 6], selectedColumns: 4 };
    }
  };
</script>
```

### Customized usage

#### Overriding the slots

It is possible to override the column picker button content.

```vue
<template>
  <BaseColumnPickerList :columns="columns" #default="{ column, isSelected }">
    <span>{{ column }} {{ isSelected ? '🟢' : '' }}</span>
  </BaseColumnPickerList>
</template>
<script>
  import { BaseColumnPickerList } from '@empathyco/xcomponents';

  export default {
    components: {
      BaseColumnPickerList
    },
    data() {
      return { columns: [2, 4, 6] };
    }
  };
</script>
```

## Events

A list of events that the component will emit:

- `UserClickedColumnPicker`: the event is emitted after the user clicks an item. The event payload
  is the number of columns that the clicked item represents.
- `ColumnsNumberProvided`: the event is emitted on component mount. The event payload is the current
  `selectedColumns` value.
</docs>
