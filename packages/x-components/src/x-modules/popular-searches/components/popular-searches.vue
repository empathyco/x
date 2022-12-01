<template>
  <BaseSuggestions
    v-bind="$attrs"
    :suggestions="popularSearches"
    class="x-popular-searches"
    data-test="popular-searches"
  >
    <template #default="defaultBaseSuggestionsScope">
      <!-- eslint-disable max-len -->
      <!--
        @slot Popular Search item
            @binding {Object} v-bind - Popular Search suggestion attributes:<br />&nbsp;&nbsp;- **suggestion** <code>Suggestion</code> - Popular Search suggestion data<br />&nbsp;&nbsp;- **index** <code>number</code> - Popular Search suggestion index
      -->
      <!-- eslint-enable max-len -->
      <slot name="suggestion" v-bind="{ ...defaultBaseSuggestionsScope }">
        <PopularSearch
          :suggestion="defaultBaseSuggestionsScope.suggestion"
          class="x-popular-searches__suggestion"
        >
          <template #default="defaultPopularSearchScope">
            <!-- eslint-disable max-len -->
            <!--
              @slot Popular Search content
                  @binding {Object} v-bind - Popular Search suggestion attributes:<br />&nbsp;&nbsp;- **suggestion** <code>Suggestion</code> - Popular Search suggestion data<br />&nbsp;&nbsp;- **index** <code>number</code> - Popular Search suggestion index
            -->
            <!-- eslint-enable max-len -->
            <slot
              name="suggestion-content"
              v-bind="{ ...defaultBaseSuggestionsScope, ...defaultPopularSearchScope }"
            />
          </template>
        </PopularSearch>
      </slot>
    </template>
  </BaseSuggestions>
</template>

<script lang="ts">
  import { Suggestion } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BaseSuggestions from '../../../components/suggestions/base-suggestions.vue';
  import { Getter } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { popularSearchesXModule } from '../x-module';
  import PopularSearch from './popular-search.vue';

  /**
   * Simple popular-searches component that renders a list of suggestions, allowing the user to
   * select one of them, and emitting the needed events.
   * A popular search is just a query that has been searched a lot in a certain period and may
   * optionally have associated a set of filters.
   *
   * @public
   */
  @Component({
    inheritAttrs: false,
    components: { PopularSearch, BaseSuggestions },
    mixins: [xComponentMixin(popularSearchesXModule)]
  })
  export default class PopularSearches extends Vue {
    /**
     * The list of popular searches.
     *
     * @internal
     */
    @Getter('popularSearches', 'popularSearches')
    public popularSearches!: Suggestion[];
  }
</script>

<!--eslint-disable max-len -->
<docs lang="mdx">
## Inherited props

This component inherits the [`BaseSuggestions`](../base-components/x-components.base-suggestions.md)
props.

| Name                          | Description                                                       | Type                | Default         |
| ----------------------------- | ----------------------------------------------------------------- | ------------------- | --------------- |
| <code>animation</code>        | Animation component that will be used to animate the suggestions. | <code>Vue</code>    | <code>ul</code> |
| <code>maxItemsToRender</code> | Number of popular searches to be rendered.                        | <code>number</code> | <code></code>   |

## Examples

### Default Usage

You don't need to pass any props, or slots. Simply add the component, and when it has any popular
searches it will show them.

```vue live
<template>
  <PopularSearches />
</template>

<script>
  import { PopularSearches } from '@empathyco/x-components/popular-searches';
  export default {
    name: 'PopularSearchesDemo',
    components: {
      PopularSearches
    }
  };
</script>
```

The component has two optional props. `animation` to render the component with an animation and
`maxItemsToRender` to limit the number of popular searches will be rendered (by default it is 5).

```vue live
<template>
  <PopularSearches :animation="'FadeAndSlide'" :maxItemsToRender="10" />
</template>

<script>
  import Vue from 'vue';
  import { PopularSearches } from '@empathyco/x-components/popular-searches';
  import FadeAndSlide from '@empathyco/x-components';

  // Registering the animation as a global component
  Vue.component('FadeAndSlide', FadeAndSlide);
  export default {
    name: 'PopularSearchesDemo',
    components: {
      PopularSearches,
      FadeAndSlide
    }
  };
</script>
```

### Overriding Popular Search's Content

You can use your custom implementation of the Popular Search's content. In the example below,
instead of using the default Popular Search's content, an icon is added, as well as a span with the
query of the Popular Search's suggestion.

```vue live
<template>
  <PopularSearches>
    <template #suggestion-content="{ suggestion }">
      <TrendingIcon />
      <span class="x-popular-search__query">{{ suggestion.query }}</span>
    </template>
  </PopularSearches>
</template>

<script>
  import { PopularSearches } from '@empathyco/x-components/popular-searches';
  import { TrendingIcon } from '@empathyco/x-components';

  export default {
    name: 'PopularSearchesDemo',
    components: {
      PopularSearches,
      TrendingIcon
    }
  };
</script>
```

### Adding a Custom Popular Search Item

You can use your custom implementation for the whole Popular Search item. In the example below, we
change the default implementation of the Popular Search in Popular Searches. A custom Popular Search
implementation is added, it has an image and a span as content (as in the previous example). Also, a
button with a user customized behaviour is added at the same hierarchical level as the Popular
Search component.

```vue live
<template>
  <PopularSearches>
    <template #suggestion="{ suggestion }">
      <PopularSearch :suggestion="suggestion">
        <template #default="{ suggestion }">
          <TrendingIcon />
          <span class="x-popular-search__query">{{ suggestion.query }}</span>
        </template>
      </PopularSearch>
      <button>Custom Behaviour</button>
    </template>
  </PopularSearches>
</template>

<script>
  import { PopularSearches, PopularSearch } from '@empathyco/x-components/popular-searches';
  import { TrendingIcon } from '@empathyco/x-components';

  export default {
    name: 'PopularSearchesDemo',
    components: {
      PopularSearches,
      PopularSearch,
      TrendingIcon
    }
  };
</script>
```
</docs>
