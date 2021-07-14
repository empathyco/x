<template>
  <NoElement>
    <!--
      @slot Customize ResultsList.
          @binding {results} results - Results to render.
          @binding {gridItems} gridItems - `Results` and `injectedGridItems`.
          @binding {animation} animation - Animation to animate the elements.
    -->
    <slot v-bind="{ results, gridItems, animation }">
      <component
        :is="animation"
        v-if="results.length"
        tag="ul"
        class="x-list x-results-list"
        data-test="results-list"
      >
        <li
          v-for="result in results"
          :key="result.id"
          class="x-results-list__item"
          data-test="results-list-item"
        >
          <!--
            @slot Customize ResultsList result.
                @binding {result} result - Result data
          -->
          <slot :result="result" name="result">{{ result.name }}</slot>
        </li>
      </component>
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
  import { XInject, XProvide } from '../../../components/decorators/injection.decorators';
  import { GridItem } from '../../../utils/types';

  /**
   * It renders a list of results from {@link SearchState.results} by default.
   *
   * The component provides a default slot which wraps the whole component with the `results` bound
   * and the `gridItems` which also contains the injected grid items from an ancestor.
   *
   * It also provides the slot result to customize the item, which is within the default slot, with
   * the result bound.
   *
   * @public
   */
  @Component({
    components: {
      NoElement
    },
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class ResultsList extends Vue implements InfiniteScroll {
    /**
     * The results to render.
     *
     * @public
     */
    @State('search', 'results')
    public results!: Result[];

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

    /**
     * It injects gridItems provided by an ancestor as injectedGridItems.
     *
     * @internal
     */
    @XInject('gridItems', <GridItem[]>[])
    public injectedGridItems!: GridItem[];

    /**
     * It provides `gridItems` which is the result of concatenating the `results` and the
     * `injectedGridItems`.
     *
     * @returns Array of `results` and `injectedGridItems`.
     *
     * @internal
     */
    @XProvide('gridItems')
    public get gridItems(): GridItem[] {
      return [...this.results, ...this.injectedGridItems];
    }
  }
</script>

<docs lang="mdx">
## Events

This component emits no events.

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
    <ResultsList>
      <template #default="{ results, animation }">
        <BaseGrid :items="results" :animation="animation">
          <template #Result="{ item }">
            <span>Result: {{ item.name }}</span>
          </template>
          <template #default="{ item }">
            <span>Default: {{ item }}</span>
          </template>
        </BaseGrid>
      </template>
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
    <ResultsList>
      <template #result="{ result }">
        <span class="result">
          {{ result.name }}
        </span>
      </template>
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

```vue
<template>
  <div>
    <SearchInput />
    <BannersList>
      <ResultsList />
    </BannersList>
  </div>
</template>

<script>
  import { SearchInput, ResultsList, BannersList } from '@empathyco/x-components/search';

  export default {
    name: 'ResultsListDemo',
    components: {
      SearchInput,
      ResultsList,
      BannersList
    }
  };
</script>
```
</docs>
