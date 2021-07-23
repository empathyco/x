<template>
  <NoElement>
    <!--
      @slot Customize ResultsList.
        @binding {Result[]} items - Results to render.
        @binding {Vue | string} animation - Animation to animate the elements.
    -->
    <slot v-bind="{ items, animation }">
      <SearchItemsList :animation="animation" :searchItems="items">
        <template v-for="(_, slotName) in $scopedSlots" v-slot:[slotName]="{ searchItem }">
          <slot :name="slotName" :searchItem="searchItem" />
        </template>
      </SearchItemsList>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import { Result } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State } from '../../../components/decorators/store.decorators';
  import { NoElement } from '../../../components/no-element';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { searchXModule } from '../x-module';
  import { InfiniteScroll } from '../../../directives/infinite-scroll/infinite-scroll.types';
  import { SEARCH_ITEMS_KEY } from '../../../components/decorators/injection.consts';
  import { XProvide } from '../../../components/decorators/injection.decorators';
  import SearchItemsList from './search-items-list.vue';

  /**
   * It renders a {@link SearchItemsList} list with the results from {@link SearchState.results} by
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
      SearchItemsList
    },
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class ResultsList extends Vue implements InfiniteScroll {
    /**
     * The results to render from the state.
     *
     * @remarks The results list are provided with {@link SEARCH_ITEMS_KEY} key. It can be
     * concatenated with search items from components such as `BannersList`, `PromotedsList`,
     * `BaseGrid` or any component that injects the list.
     *
     * @public
     */
    @XProvide(SEARCH_ITEMS_KEY)
    @State('search', 'results')
    public items!: Result[];

    /**
     * Animation component that will be used to animate the results.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue | string;

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

### Play with the animation

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList :animation="fadeAndSlide" />
  </div>
</template>

<script>
  import { SearchInput, ResultsList } from '@empathyco/x-components/search';
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
        <template #Result="{ item }">
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

### Overriding result content

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList #result="{ result }">
      <span class="result">
        {{ result.name }}
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

Starting with the `ResultsList` component as root element, you can concat the list of search items
using `BannersList`, `PromotedsList`, `BaseGrid` or any component that injects the `searchItems`
value.

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <BannersList>
        <PromotedsList>
          <template #result="{ searchItem }">Result: {{ searchItem.id }}</template>
          <template #banner="{ searchItem }">Banner: {{ searchItem.id }}</template>
          <template #promoted="{ searchItem }">Promoted: {{ searchItem.id }}</template>
        </PromotedsList>
      </BannersList>
    </ResultsList>
  </div>
</template>

<script>
  import {
    SearchInput,
    ResultsList,
    BannersList,
    PromotedsList
  } from '@empathyco/x-components/search';

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
