<template>
  <component :is="animation" tag="ul" class="x-option-list x-sort-list" data-test="sort-list">
    <li
      v-for="{ item, cssClasses, event } in listItems"
      :key="item"
      :class="cssClasses"
      class="x-option-list__item x-sort-list__item"
    >
      <BaseEventButton
        class="x-button x-sort-list__button"
        data-test="x-sort-button"
        :events="event"
      >
        <slot v-bind="{ item, isSelected: item === selectedSort }">
          {{ item }}
        </slot>
      </BaseEventButton>
    </li>
  </component>
</template>

<style lang="scss" scoped>
  .x-sort-list {
    list-style-type: none;
  }
</style>

<script lang="ts">
  import { Sort } from '@empathy/search-types';
  import Vue from 'vue';
  import { mixins } from 'vue-class-component';
  import { Component, Prop } from 'vue-property-decorator';
  import { BaseEventButton } from '../../../components';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { VueCSSClasses } from '../../../utils';
  import { XEventsTypes } from '../../../wiring';
  import { searchXModule } from '../x-module';
  import SortMixin from './sort.mixin';

  /**
   * Sort list item options.
   *
   * @public
   */
  interface SortListItem {
    item: Sort;
    cssClasses: VueCSSClasses;
    event: Partial<XEventsTypes>;
  }
  /**
   * The `SortList` component allows user to select the search results order. This component
   * also allows to change the selected sort programmatically.
   *
   * @remarks It extends {@link SortMixin}.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchXModule)],
    components: {
      BaseEventButton
    }
  })
  export default class SortList extends mixins(SortMixin) {
    /**
     * The transition to use for rendering the list.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    public animation?: string | typeof Vue;
    /**
     * Sort list items.
     *
     * @returns A list of items with their css class and the event associate to it.
     *
     * @internal
     */
    protected get listItems(): SortListItem[] {
      return this.items.map(item => ({
        item,
        cssClasses: [
          {
            'x-sort-list__item--is-selected': item === this.selectedSort,
            'x-option-list__item--is-selected': item === this.selectedSort
          }
        ],
        event: { UserClickedASort: item }
      }));
    }
  }
</script>

<docs lang="mdx">
# Sort List

The `SortList` component can be used to change the way the search results are ordered.

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
  <SortList :items="sortValues">
    <template #item="{ item, isSelected }">Item: {{ item }}</template>
  </SortList>
</template>

<script>
  import { SortList } from '@empathy/x-components/search';

  export default {
    components: {
      SortList
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
  <SortList v-model="selectedSort" :items="sortValues">
    <template #item="{ item, isSelected }">
      <span v-if="isSelected">✅</span>
      {{ item }}
    </template>
  </SortList>
</template>

<script>
  import { SortList } from '@empathy/x-components/search';

  export default {
    components: {
      SortList
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

## Events

This component emits 2 different events:

- SelectedSortProvided: To sync the selected sort with the store state value. This event is emitted
  as soon as the list of items is received, whenever this list changes if there is no provided
  value, and when the provided value changes.
- UserClickedASort: As its name suggest, the event is emitted after the user clicks one of the sort
  options. This does not mean that the sort has changed, only that the user has clicked it.
</docs>
