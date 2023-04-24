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
      :aria-pressed="item === selectedSort"
      role="listitem"
    >
      <slot v-bind="{ item, isSelected: item === selectedSort }">
        {{ item }}
      </slot>
    </BaseEventButton>
  </component>
</template>

<script lang="ts">
  import { Sort } from '@empathyco/x-types';
  import { mixins } from 'vue-class-component';
  import { Component, Prop } from 'vue-property-decorator';
  import Vue from 'vue';
  import { BaseEventButton } from '../../../components';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { VueCSSClasses } from '../../../utils';
  import { XEventsTypes } from '../../../wiring';
  import { searchXModule } from '../x-module';
  import { dynamicPropsMixin } from '../../../components/dynamic-props.mixin';
  import SortMixin from './sort.mixin';

  /**
   * Sort Picker item options.
   *
   * @public
   */
  interface SortPickerItem {
    item: Sort;
    cssClasses: VueCSSClasses;
    event: Partial<XEventsTypes>;
  }
  /**
   * The `SortPickerList` component allows user to select the search results order. This component
   * also allows to change the selected sort programmatically.
   *
   * @remarks It extends {@link SortMixin}.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchXModule), dynamicPropsMixin(['buttonClass'])],
    components: {
      BaseEventButton
    }
  })
  export default class SortPickerList extends mixins(SortMixin) {
    /**
     * The transition to use for rendering the list.
     *
     * @public
     */
    @Prop({ default: 'div' })
    public animation?: string | typeof Vue;
    /**
     * Sort list items.
     *
     * @returns A list of items with their css class and the event associate to it.
     *
     * @internal
     */
    protected get listItems(): SortPickerItem[] {
      return this.items.map(item => ({
        item,
        cssClasses: [
          {
            'x-selected': item === this.selectedSort
          }
        ],
        event: { UserClickedASort: item }
      }));
    }
  }
</script>

<docs lang="mdx">
## Sort Picker List

The `SortPickerList` component can be used to change the way the search results are ordered.

To do so, the list of valid sort values has to be provided using the `items` prop. These are the
values that can then be received in the `SearchAdapter`.

The component also optionally accepts the selected sort, which can be set using the `value` prop.
This prop allows changing programmatically the selected sort, as it will be synced with the store
immediately. If this prop is not provided, the first item from the `items` prop will be the one
selected by default.

This component also allows customizing each one of the possible sort values. This can be done with
the `default` slot.

## Examples

### Only providing the list of items

```vue
<template>
  <SortPickerList :items="sortValues">
    <template #item="{ item, isSelected }">Item: {{ item }}</template>
  </SortPickerList>
</template>

<script>
  import { SortPickerList } from '@empathyco/x-components/search';

  export default {
    components: {
      SortPickerList
    },
    data() {
      return { sortValues: ['Relevance', 'Price asc', 'Price desc'] };
    }
  };
</script>
```

### Providing also the selected value

```vue
<template>
  <SortPickerList v-model="selectedSort" :items="sortValues">
    <template #item="{ item, isSelected }">
      <span v-if="isSelected">✅</span>
      {{ item }}
    </template>
  </SortPickerList>
</template>

<script>
  import { SortPickerList } from '@empathyco/x-components/search';

  export default {
    components: {
      SortPickerList
    },
    data() {
      return {
        selectedSort: 'Price asc',
        sortValues: ['Relevance', 'Price asc', 'Price desc']
      };
    }
  };
</script>
```

### Customizing the items with classes

The `buttonClass` prop can be used to add classes to the sort items.

```vue
<template>
  <SortPickerList :items="sortValues" buttonClass="x-button-outlined" />
</template>

<script>
  import { SortPickerList } from '@empathyco/x-components/search';

  export default {
    components: {
      SortPickerList
    },
    data() {
      return { sortValues: ['Relevance', 'Price asc', 'Price desc'] };
    }
  };
</script>
```

## Events

This component emits 2 different events:

- SelectedSortProvided: To sync the selected sort with the store state value. This event is emitted
  as soon as the list of items is received, whenever this list changes if there is no provided
  value, and when the provided value changes.
- UserClickedASort: As its name suggest, the event is emitted after the user clicks one of the sort
  options. This does not mean that the sort has changed, only that the user has clicked it.
</docs>
