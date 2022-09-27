<template>
  <NoElement>
    <!--
      @slot Next queries list layout.
        @binding {SearchItem[]} items - Next queries groups plus the injected list items to
        render.
        @binding {Vue | string} animation - Animation to animate the elements.
    -->
    <slot v-bind="{ items, animation }">
      <ItemsList :animation="animation" :items="items">
        <template v-for="(_, slotName) in $scopedSlots" v-slot:[slotName]="{ item }">
          <slot :name="slotName" :item="item" />
        </template>
      </ItemsList>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { NextQuery } from '@empathyco/x-types';
  import { mixins } from 'vue-class-component';
  import { Component, Prop } from 'vue-property-decorator';
  import { Getter } from '../../../components/decorators/store.decorators';
  import { NoElement } from '../../../components/no-element';
  import { ItemsListInjectionMixin } from '../../../components/items-list-injection.mixin';
  import ItemsList from '../../../components/items-list.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { groupItemsBy } from '../../../utils/array';
  import { ListItem } from '../../../utils/types';
  import { NextQueriesGroup } from '../types';
  import { nextQueriesXModule } from '../x-module';
  import { XInject } from '../../../components/decorators/injection.decorators';
  import { HAS_MORE_ITEMS_KEY, QUERY_KEY } from '../../../components/decorators/injection.consts';

  /**
   * Component that inserts groups of next queries in different positions of the injected search
   * items list, based on the provided configuration.
   *
   * @public
   */
  @Component({
    components: {
      NoElement,
      ItemsList
    },
    mixins: [xComponentMixin(nextQueriesXModule)]
  })
  export default class NextQueriesList extends mixins(ItemsListInjectionMixin) {
    /**
     * Animation component that will be used to animate the next queries groups.
     *
     * @public
     */
    @Prop()
    protected animation?: Vue | string;

    /**
     * The first index to insert a group of next queries at.
     *
     * @public
     */
    @Prop({ default: 24 })
    public offset!: number;

    /**
     * The items cycle size to keep inserting next queries groups at.
     *
     * @public
     */
    @Prop({ default: 24 })
    public frequency!: number;

    /**
     * The maximum amount of next queries to add in a single group.
     *
     * @public
     */
    @Prop({ default: 4 })
    public maxNextQueriesPerGroup!: number;

    /**
     * The maximum number of groups to insert into the injected list items list.
     *
     * @public
     */
    @Prop()
    public maxGroups!: number;

    /**
     * Determines if a group is added to the injected items list in case the number
     * of items is smaller than the offset.
     *
     * @public
     */
    @Prop({ default: false })
    public showOnlyAfterOffset!: boolean;

    /**
     * The state next queries.
     *
     * @internal
     */
    @Getter('nextQueries', 'nextQueries')
    public nextQueries!: NextQuery[];

    /**
     * Injected query, updated when the related request(s) have succeeded.
     */
    @XInject(QUERY_KEY)
    public injectedQuery!: string | undefined;

    /**
     * Indicates if there are more available results than the injected.
     */
    @XInject(HAS_MORE_ITEMS_KEY)
    public hasMoreItems!: boolean;

    /**
     * The grouped next queries based on the given config.
     *
     * @returns A list of next queries groups.
     * @internal
     */
    protected get nextQueriesGroups(): NextQueriesGroup[] {
      return Object.values(
        groupItemsBy(this.nextQueries, (_, index) =>
          Math.floor(index / this.maxNextQueriesPerGroup)
        )
      )
        .slice(0, this.maxGroups)
        .map(nextQueries => ({
          modelName: 'NextQueriesGroup' as const,
          id: nextQueries.map(nextQuery => nextQuery.query).join(','),
          nextQueries
        }));
    }

    /**
     * New list of {@link ListItem}s to render.
     *
     * @returns The new list of {@link ListItem}s with the next queries groups inserted.
     * @internal
     */
    public override get items(): ListItem[] {
      if (!this.injectedListItems) {
        return this.nextQueriesGroups;
      }
      if (this.nextQueriesAreOutdated) {
        return this.injectedListItems;
      }
      if (this.hasNotEnoughListItems) {
        return this.injectedListItems.concat(this.nextQueriesGroups[0] ?? []);
      }
      return this.nextQueriesGroups.reduce(
        (items, nextQueriesGroup, index) => {
          const targetIndex = this.offset + this.frequency * index;
          if (targetIndex <= items.length) {
            items.splice(targetIndex, 0, nextQueriesGroup);
          }
          return items;
        },
        [...this.injectedListItems]
      );
    }

    /**
     * Checks if the next queries are outdated taking into account the injected query.
     *
     * @returns True if the next queries are outdated, false if not.
     * @internal
     */
    protected get nextQueriesAreOutdated(): boolean {
      return (
        !!this.injectedQuery &&
        (this.$x.query.nextQueries !== this.injectedQuery ||
          this.$x.status.nextQueries !== 'success')
      );
    }

    /**
     * Checks if the number of items is smaller than the offset so a group
     * should be added to the injected items list.
     *
     * @returns True if a group should be added, false if not.
     * @internal
     */
    protected get hasNotEnoughListItems(): boolean {
      return (
        !this.showOnlyAfterOffset &&
        !this.hasMoreItems &&
        this.injectedListItems !== undefined &&
        this.injectedListItems.length > 0 &&
        this.offset > this.injectedListItems.length
      );
    }
  }
</script>

<docs lang="mdx">
## Events

This component emits no events.

## See it in action

<!-- prettier-ignore-start -->
:::warning Backend microservice required
To use this component, the <b>QuerySignals</b> microservice must be
implemented.
:::
<!-- prettier-ignore-end -->

Usually, this component is going to be used together with the `ResultsList` one. Next queries groups
will be inserted between the results, guiding users to discover new searches directly from the
results list.

```vue live
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <NextQueriesList />
    </ResultsList>
  </div>
</template>

<script>
  import { NextQueriesList } from '@empathyco/x-components/next-queries';
  import { ResultsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'NextQueriesListDemo',
    components: {
      NextQueriesList,
      ResultsList,
      SearchInput
    }
  };
</script>
```

### Play with the index that next queries groups are inserted at

The component allows to customise where are the next queries groups inserted. In the following
example, the first group of next queries will be inserted at the index `48` (`offset`), and then a
second group will be inserted at index `120` because of the `frequency` prop configured to `72`.
Finally, a third group will be inserted at index `192`. Because `maxGroups` is configured to `3`, no
more groups will be inserted. Each one of this groups will have up to `6` next queries
(`maxNextQueriesPerGroup`).

```vue live
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <NextQueriesList :offset="48" :frequency="72" :maxNextQueriesPerGroup="6" :maxGroups="3" />
    </ResultsList>
  </div>
</template>

<script>
  import { NextQueriesList } from '@empathyco/x-components/next-queries';
  import { ResultsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'NextQueriesListDemo',
    components: {
      NextQueriesList,
      ResultsList,
      SearchInput
    }
  };
</script>
```

### Showing/hiding first next queries group when no more items

By default, the first next query group will be inserted when the total number of results is smaller
than the offset, but this behavior can be disabled setting the `showOnlyAfterOffset` to `true`.

```vue live
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <NextQueriesList
        :offset="48"
        :frequency="72"
        :maxNextQueriesPerGroup="1"
        :showOnlyAfterOffset="true"
      />
    </ResultsList>
  </div>
</template>

<script>
  import { NextQueriesList } from '@empathyco/x-components/next-queries';
  import { ResultsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'NextQueriesListDemo',
    components: {
      NextQueriesList,
      ResultsList,
      SearchInput
    }
  };
</script>
```

### Customise the layout of the component

This component will render by default the `id` of each search item, both the injected, and for the
groups of next queries generated, but the common case is to integrate it with another layout
component, for example the `BaseGrid`. To do so, you can use the `default` slot

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <NextQueriesList
        :offset="48"
        :frequency="72"
        :maxNextQueriesPerGroup="6"
        :maxGroups="3"
        #default="{ items }"
      >
        <BaseGrid :items="items" :animation="animation">
          <template #next-queries-group="{ item }">
            <span>NextQueriesGroup: {{ item.queries.join(', ') }}</span>
          </template>
          <template #result="{ item }">
            <span>Result: {{ item.name }}</span>
          </template>
          <template #default="{ item }">
            <span>Default: {{ item }}</span>
          </template>
        </BaseGrid>
      </NextQueriesList>
    </ResultsList>
  </div>
</template>

<script>
  import { NextQueriesList } from '@empathyco/x-components/next-queries';
  import { ResultsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { BaseGrid } from '@empathyco/x-components';

  export default {
    name: 'NextQueriesListDemo',
    components: {
      NextQueriesList,
      ResultsList,
      BaseGrid,
      SearchInput
    }
  };
</script>
```
</docs>
