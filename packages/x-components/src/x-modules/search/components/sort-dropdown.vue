<template>
  <BaseDropdown
    @change="emitUserClickedASort"
    :animation="animation"
    :items="items"
    :value="selectedSort"
    class="x-sort-dropdown"
    data-test="sort-dropdown"
  >
    <template #toggle="{ isOpen, item }">
      <!--
       @slot Used to render the contents of the dropdown toggle button. If not provided, it uses
       the item slot as fallback.
       @binding {Sort} item - The sort data to render.
       @binding {boolean} isOpen - True if the dropdown is opened, and false if it is closed.
      -->
      <slot v-bind="{ isOpen, item }" name="toggle" />
    </template>
    <template #item="{ item, isHighlighted, isSelected }">
      <!--
        @slot (required) Used to render each one of the items content, and as fallback
        for the toggle button content slot if it is not provided.
        @binding {Sort} item - Sort to render
        @binding {boolean} isHighlighted - True when the item has the focus.
        @binding {boolean} isSelected - True when the item is selected.
      -->
      <slot v-bind="{ item, isHighlighted, isSelected }" name="item" />
    </template>
  </BaseDropdown>
</template>

<script lang="ts">
  import { Sort } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import BaseDropdown from '../../../components/base-dropdown.vue';
  import { State } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { searchXModule } from '../x-module';

  /**
   * The `SortDropdown` component allows user to select the search results order. This component
   * also allows to change the selected sort programmatically.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchXModule)],
    components: { BaseDropdown },
    model: {
      event: 'change'
    }
  })
  export default class SortDropdown extends Vue {
    /**
     * The transition to use for opening and closing the dropdown.
     *
     * @public
     */
    @Prop()
    public animation?: string | typeof Vue;

    /**
     * The list of possible sort values. If the {@link SortDropdown.value} option
     * is not provided, the first item of this list will be selected.
     *
     * @public
     */
    @Prop({ required: true })
    public items!: Sort[];

    /**
     * The search module selected sort. This is the source of truth when checking which
     * sort is selected.
     *
     * @internal
     */
    @State('search', 'sort')
    public selectedSort!: Sort;

    /**
     * The selected sort value. This is an optional prop that allows to change programmatically
     * the selected sort. If it is not provided, the first item of the {@link SortDropdown.items}
     * list will be selected.
     *
     * @public
     */
    @Prop()
    public value?: Sort;

    /**
     * Registers the needed watchers to sync the state with the props.
     *
     * @internal
     */
    created(): void {
      /* Watcher is defined here because the `$x` object isn't created until this hook */
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.$watch('value', this.emitProvidedValueChanged, { immediate: true });
    }

    /**
     * Emits the {@link SearchXEvents.SelectedSortProvided} event if the provided sort differs
     * from the state selected sort.
     *
     * @param sort - The provided sort.
     * @internal
     */
    protected emitProvidedValueChanged(sort: Sort = this.items[0]): void {
      if (sort !== this.selectedSort) {
        this.$x.emit('SelectedSortProvided', sort, { target: this.$el as HTMLElement });
      }
    }

    /**
     * Emits the events related to the selection of a sort value.
     *
     * @param sort - The selected sort.
     * @internal
     */
    protected emitUserClickedASort(sort: Sort): void {
      this.$x.emit('UserClickedASort', sort, { target: this.$el as HTMLElement });
      this.$emit('change', sort);
    }

    /**
     * If there is no value provided, and the items has changed, it selects the first one of
     * the `items`.
     *
     * @param items - The new possible sort values.
     * @internal
     */
    @Watch('items')
    protected syncSelectedItem(items: Sort[]): void {
      if (this.value === undefined) {
        this.emitProvidedValueChanged(items[0]);
      }
    }
  }
</script>

<docs lang="mdx">
# Sort Dropdown

The `SortDropdown` component can be used to change the way the search results are ordered.

To do so, the list of valid sort values has to be provided using the `items` prop. These are the
values that can be received then in the `SearchAdapter`.

The component also optionally accepts the selected sort, which can be set using the `value` prop.
This prop allows changing programmatically the selected sort, as it will be synced with the store
immediately. If this prop is not provided, the first item from the `items` prop will be the one
selected by default.

This component also allows customizing both the toggle button and each one of the possible sort
values. This can be done with the`toggle` and `item` slots.

## Examples

### Only providing the list of items

```vue
<template>
  <SortDropdown :items="sortValues">
    <template #toggle="{ item, isOpen }">{{ item }} {{ isOpen ? '🔼' : '🔽' }}</template>
    <template #item="{ item, isHighlighted, isSelected }">
      <span v-if="isSelected">✅</span>
      <span v-if="isHighlighted">🟢</span>
      {{ item }}
    </template>
  </SortDropdown>
</template>

<script>
  import { SortDropdown } from '@empathy/x-components/search';

  export default {
    components: {
      SortDropdown
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
  <SortDropdown v-model="selectedSort" :items="sortValues">
    <template #toggle="{ item, isOpen }">{{ item }} {{ isOpen ? '🔼' : '🔽' }}</template>
    <template #item="{ item, isHighlighted, isSelected }">
      <span v-if="isSelected">✅</span>
      <span v-if="isHighlighted">🟢</span>
      {{ item }}
    </template>
  </SortDropdown>
</template>

<script>
  import { SortDropdown } from '@empathy/x-components/search';

  export default {
    components: {
      SortDropdown
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
