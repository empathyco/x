<template>
  <ul class="x-option-list x-column-picker-list" data-test="column-picker-list">
    <li
      v-for="{ column, cssClasses } in columnsWithCssClasses"
      :key="column"
      :class="cssClasses"
      class="x-option-list__item x-column-picker-list__item"
      data-test="column-picker-item"
    >
      <BaseEventButton
        class="x-button column-picker-item__button"
        data-test="column-picker-button"
        :events="{ UserClickedColumnPicker: column }"
      >
        <!--
          @slot Customized Column Picker Button content. Specifying a slot with the column value
          will result in the column using that slot composition to render.
              @binding {column} column - Column Number to pick.
        -->
        <slot v-bind="{ column }">
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
  import { Component } from 'vue-property-decorator';
  import { mixins } from 'vue-class-component';
  import { VueCSSClasses } from '../../utils/types';
  import BaseEventButton from '../base-event-button.vue';
  import ColumnPickerMixin from './column-picker.mixin';

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
    public get columnsWithCssClasses(): {
      column: number;
      cssClasses: VueCSSClasses;
    }[] {
      return this.columns.map(column => ({
        column,
        cssClasses: [
          `x-column-picker-list__item--${column}-cols`,
          {
            'x-column-picker-list__item--is-selected': this.selectedColumn === column,
            'x-option-list__item--is-selected': this.selectedColumn === column
          }
        ]
      }));
    }
  }
</script>

<docs>
#Examples

This component renders a list of elements in different slots depending on the columns prop.
Each element will emit an event with the number of columns that it is being selected when it is
clicked.

## Default usage

It is required to send the columns prop.

```vue
<BaseColumnPickerList :columns="[2, 4, 6]"/>
```
### Using v-model

It is possible to do two way binding in order to synchronize the value with the parents. It will be
updated if it changed the value or if the parent changes it.

```vue
<BaseColumnPickerList #default="{ column }" v-model="currentColumn" :columns="[2, 4, 6]" />
```

## Customized usage

### Overriding the slots

It is possible to override the column picker button content.

```vue
<BaseColumnPickerList #default="{ column }" :columns="[2, 4, 6]">
  <span>{{ column }}</span>
</BaseColumnPickerList>
```

## Events

A list of events that the component will emit:

- `UserClickedColumnPicker`: the event is emitted after the user clicks an item. The event payload
is the number of columns that the clicked item represents.
- `ColumnPickerSetColumnsNumber`: the event is emitted on component mount. The event payload
is the current `selectedColumn` value.
</docs>
