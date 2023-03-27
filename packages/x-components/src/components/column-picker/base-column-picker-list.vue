<template>
  <div class="x-column-picker-list x-button-group" data-test="column-picker-list">
    <template v-for="({ column, cssClasses, events, isSelected }, index) in columnsWithCssClasses">
      <BaseEventButton
        :key="column"
        class="x-column-picker-list__button x-button"
        :class="[buttonClass, cssClasses]"
        data-test="column-picker-button"
        :aria-pressed="isSelected"
        :events="events"
        :aria-label="`${column} columns`"
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
  import { mixins } from 'vue-class-component';
  import { Component } from 'vue-property-decorator';
  import { VueCSSClasses } from '../../utils/types';
  import { XEventsTypes } from '../../wiring';
  import BaseEventButton from '../base-event-button.vue';
  import { dynamicPropsMixin } from '../dynamic-props.mixin';
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
   * Additionally, this component exposes the following props to modify the classes of the
   * elements: `buttonClass`.
   *
   * @remarks It extends {@link ColumnPickerMixin}.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton }
  })
  export default class BaseColumnPickerList extends mixins(
    ColumnPickerMixin,
    dynamicPropsMixin(['buttonClass'])
  ) {
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
          `x-column-picker-list__button--${column}-cols`,
          {
            'x-selected': this.selectedColumns === column
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

It also possible to add a divider element between the column picker buttons by overriding the
`divider` slot.

```vue
<template>
  <BaseColumnPickerList :columns="columns">
    <template #divider></template>
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

#### Customizing the buttons with classes

The `buttonClass` prop can be used to add classes to the buttons.

```vue
<template>
  <BaseColumnPickerList :columns="columns" buttonClass="x-button--round" />
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
