<template>
  <NoElement>
    <!--
      @slot Customize ResultsList.
        @binding {Result[]} items - Results to render.
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
  import { Result } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import {
    HAS_MORE_ITEMS_KEY,
    LIST_ITEMS_KEY,
    QUERY_KEY
  } from '../../../components/decorators/injection.consts';
  import { XProvide } from '../../../components/decorators/injection.decorators';
  import { State } from '../../../components/decorators/store.decorators';
  import { NoElement } from '../../../components/no-element';
  import ItemsList from '../../../components/items-list.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { InfiniteScroll } from '../../../directives/infinite-scroll/infinite-scroll.types';
  import { searchXModule } from '../x-module';
  import { RequestStatus } from '../../../store/utils/status-store.utils';

  /**
   * It renders a {@link ItemsList} list with the results from {@link SearchState.results} by
   * default.
   *
   * The component provides a default slot which wraps the whole component with the `results` bound.
   *
   * It also provides the slot result to customize the item, which is within the default slot, with
   * the result bound.
   *
   * @public
   */
  @Component({
    components: {
      NoElement,
      ItemsList
    },
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class ResultsList extends Vue implements InfiniteScroll {
    /**
     * The results to render from the state.
     *
     * @remarks The results list are provided with `items` key. It can be
     * concatenated with list items from components such as `BannersList`, `PromotedsList`,
     * `BaseGrid` or any component that injects the list.
     *
     * @public
     */
    @XProvide(LIST_ITEMS_KEY)
    @State('search', 'results')
    public items!: Result[];

    /**
     * It provides the search query.
     * This query is updated only when the search request has succeeded.
     */
    @XProvide(QUERY_KEY)
    public providedQuery = '';

    /**
     * Indicates if there are more available results that have not been injected.
     *
     * @returns Boolean.
     * @public
     */
    @XProvide(HAS_MORE_ITEMS_KEY)
    public get hasMoreItems(): boolean {
      return this.items.length < this.totalResults;
    }

    /**
     * The total number of results, taken from the state.
     */
    @State('search', 'totalResults')
    public totalResults!: number;

    /**
     * The status of the search request, taken from the state.
     */
    @State('search', 'status')
    public searchStatus!: RequestStatus;

    /**
     * The query of the search request, taken from the state.
     */
    @State('search', 'query')
    public searchQuery!: string;

    /**
     * Animation component that will be used to animate the results.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue | string;

    /**
     * Updates the query to be provided to the child components
     * when the search request has succeeded.
     *
     * @param status - The status of the search request.
     */
    @Watch('searchStatus')
    updateQuery(status: RequestStatus): void {
      if (status === 'success') {
        this.providedQuery = this.searchQuery;
      }
    }

    /**
     * It emits an {@link SearchXEvents.UserReachedResultsListEnd} event.
     *
     * @internal
     */
    onInfiniteScrollEnd(): void {
      this.$x.emit('UserReachedResultsListEnd');
    }
  }
</script>

<docs lang="mdx">
## Events

This component doesn't emit events.

## See it in action

<!-- prettier-ignore-start -->
:::warning Backend service required
To use this component, the Search service must be implemented.
:::
<!-- prettier-ignore-end -->

Here you have a basic example of how the ResultsList is rendered.

_Type any term in the input field to try it out!_

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList />
  </div>
</template>

<script>
  import { ResultsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'ResultsListDemo',
    components: {
      SearchInput,
      ResultsList
    }
  };
</script>
```

### Play with the animation

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList :animation="fadeAndSlide" />
  </div>
</template>

<script>
  import { ResultsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { FadeAndSlide } from '@empathyco/x-components/animations';

  export default {
    name: 'ResultsListDemo',
    components: {
      SearchInput,
      ResultsList
    },
    data() {
      return {
        fadeAndSlide: FadeAndSlide
      };
    }
  };
</script>
```

### Overriding default content

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList #default="{ items, animation }">
      <BaseGrid :items="items" :animation="animation">
        <template #result="{ item }">
          <span>Result: {{ item.name }}</span>
        </template>
        <template #default="{ item }">
          <span>Default: {{ item }}</span>
        </template>
      </BaseGrid>
    </ResultsList>
  </div>
</template>

<script>
  import { ResultsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { BaseGrid } from '@empathyco/x-components';

  export default {
    name: 'ResultsListDemo',
    components: {
      SearchInput,
      ResultsList,
      BaseGrid
    }
  };
</script>
```

### Overriding result content

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList #result="{ item }">
      <span class="result">
        {{ item.name }}
      </span>
    </ResultsList>
  </div>
</template>

<script>
  import { SearchInput, ResultsList } from '@empathyco/x-components/search';

  export default {
    name: 'ResultsListDemo',
    components: {
      SearchInput,
      ResultsList
    }
  };
</script>
```

### Data injection

Starting with the `ResultsList` component as root element, you can concat the list of list items
using `BannersList`, `PromotedsList`, `BaseGrid` or any component that injects the `listItems`
value.

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <BannersList>
        <PromotedsList>
          <template #result="{ item }">Result: {{ item.id }}</template>
          <template #banner="{ item }">Banner: {{ item.id }}</template>
          <template #promoted="{ item }">Promoted: {{ item.id }}</template>
        </PromotedsList>
      </BannersList>
    </ResultsList>
  </div>
</template>

<script>
  import { ResultsList, BannersList, PromotedsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'ResultsListDemo',
    components: {
      SearchInput,
      ResultsList,
      BannersList,
      PromotedsList
    }
  };
</script>
```
</docs>
