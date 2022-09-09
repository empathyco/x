<template>
  <BaseSuggestions
    :suggestions="renderedNextQueries"
    data-test="next-queries"
    class="x-next-queries"
    :animation="animation"
    :maxItemsToRender="maxItemsToRender"
  >
    <template #default="{ suggestion, index }">
      <!--
        @slot Next Query item
            @binding {Suggestion} suggestion - Next Query suggestion data
            @binding {number} index - Next Query suggestion index
            @binding {boolean} highlightCurated - True if the curated NQs should be highlighted
      -->
      <slot name="suggestion" v-bind="{ suggestion, highlightCurated, index }">
        <NextQuery
          #default="{ suggestion, shouldHighlightCurated }"
          :suggestion="suggestion"
          :highlightCurated="highlightCurated"
          class="x-next-queries__suggestion"
        >
          <!--
              @slot Next Query content
                  @binding {Suggestion} suggestion - Next Query suggestion data
                  @binding {boolean} shouldHighlightCurated - True if the curated NQ should
                  be highlighted
                  @binding {number} index - Next Query suggestion index
            -->
          <slot name="suggestion-content" v-bind="{ suggestion, shouldHighlightCurated, index }" />
        </NextQuery>
      </slot>
    </template>
  </BaseSuggestions>
</template>

<script lang="ts">
  import { NextQuery as NextQueryModel } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import BaseSuggestions from '../../../components/suggestions/base-suggestions.vue';
  import { Getter } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { nextQueriesXModule } from '../x-module';
  import NextQuery from './next-query.vue';

  /**
   * Simple next-queries component that renders a list of suggestions, allowing the user to
   * select one of them, and emitting the needed events.
   * A next query is a suggestion for a new search, related to your previous query. I.e. If
   * people normally search for `shirts`, and then `trousers`, `trousers` would be a next query
   * of `shirts`.
   *
   * @public
   */
  @Component({
    components: { NextQuery, BaseSuggestions },
    mixins: [xComponentMixin(nextQueriesXModule)]
  })
  export default class NextQueries extends Vue {
    /**
     * Animation component that will be used to animate the suggestions.
     *
     * @public
     */
    @Prop()
    public animation?: Vue;

    /**
     * Number of next queries to be rendered.
     *
     * @public
     */
    @Prop()
    public maxItemsToRender?: number;

    /**
     * Flag to indicate if the curated next queries should be displayed different.
     *
     * @public
     */
    @Prop({ default: false, type: Boolean })
    public highlightCurated!: boolean;

    /**
     * NextQueries list to be used instead of state NextQueries.
     *
     * @public
     */
    @Prop()
    public suggestions?: NextQueryModel[];

    /**
     * The list of next queries from the state.
     *
     * @internal
     */
    @Getter('nextQueries', 'nextQueries')
    public stateNextQueries!: NextQueryModel[];

    /**.
     * The list of next queries finally rendered
     *
     * @internal
     */
    protected get renderedNextQueries(): NextQueryModel[] {
      return this.suggestions ?? this.stateNextQueries;
    }
  }
</script>

<docs lang="mdx">
## Examples

### Basic example

You don't need to pass any props, or slots. Simply add the component, and when it has any next
queries it will show them

```vue live
<template>
  <div>
    <SearchInput />
    <NextQueries />
  </div>
</template>

<script>
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { NextQueries } from '@empathyco/x-components/next-queries';

  export default {
    name: 'NextQueriesDemo',
    components: {
      SearchInput,
      NextQueries
    }
  };
</script>
```

The component has three optional props. `animation` to render the component with an animation,
`maxItemToRender` to limit the number of next queries will be rendered (by default it is 5) and
`highlightCurated` to indicate if the curated Next Queries inside the list should be highlighted.

```vue live
<template>
  <div>
    <SearchInput />
    <NextQueries :animation="'FadeAndSlide'" :maxItemsToRender="10" :highlightCurated="true" />
  </div>
</template>

<script>
  import Vue from 'vue';
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { NextQueries } from '@empathyco/x-components/next-queries';
  import { FadeAndSlide } from '@empathyco/x-components';

  // Registering the animation as a global component
  Vue.component('FadeAndSlide', FadeAndSlide);
  export default {
    name: 'NextQueriesDemo',
    components: {
      SearchInput,
      NextQueries
    }
  };
</script>
```

### Overriding Next Queries' Content

You can use your custom implementation of the Next Query's content. In the example below, instead of
using the default Next Query's content, an icon is added, as well as a span with the query of the
Next Query suggestion.

```vue live
<template>
  <div>
    <SearchInput />
    <NextQueries>
      <template #suggestion-content="{ suggestion }">
        <Nq1Icon />
        <span class="x-next-query__query">{{ suggestion.query }}</span>
      </template>
    </NextQueries>
  </div>
</template>

<script>
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { NextQueries } from '@empathyco/x-components/next-queries';
  import { Nq1Icon } from '@empathyco/x-components';

  export default {
    name: 'NextQueriesDemo',
    components: {
      SearchInput,
      NextQueries,
      Nq1Icon
    }
  };
</script>
```

### Adding a custom next query component

You can use your custom implementation of a next query component. To work correctly, it should use
the `emitNextQuerySelected` function when the next query is selected. In the example below, instead
of using the default `button` tag for a next query, an icon is added, and the text of the next query
is wrapped in a `span`

```vue live
<template>
  <div>
    <SearchInput />
    <NextQueries>
      <template #suggestion="{ suggestion }">
        <NextQuery :suggestion="suggestion" class="x-next-queries__suggestion">
          <template #default="{ suggestion }">
            <Nq1Icon />
            <span class="x-next-query__query">{{ suggestion.query }}</span>
          </template>
        </NextQuery>
        <button>Custom Behaviour</button>
      </template>
    </NextQueries>
  </div>
</template>

<script>
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { NextQueries, NextQuery } from '@empathyco/x-components/next-queries';
  import { Nq1Icon } from '@empathyco/x-components';

  export default {
    name: 'NextQueriesDemo',
    components: {
      SearchInput,
      NextQueries,
      NextQuery,
      Nq1Icon
    }
  };
</script>
```
</docs>
