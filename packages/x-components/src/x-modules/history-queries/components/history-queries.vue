<template>
  <BaseSuggestions
    :suggestions="historyQueries"
    class="x-history-queries"
    data-test="history-queries"
    :animation="animation"
    :maxItemsToRender="maxItemsToRender"
  >
    <template #default="{ suggestion, index }">
      <!--
        @slot History Query item
            @binding {Suggestion} suggestion - History Query suggestion data
            @binding {number} index - History Query suggestion index
      -->
      <slot name="suggestion" v-bind="{ suggestion, index }">
        <HistoryQuery
          :suggestion="suggestion"
          data-test="history-query-item"
          class="x-history-queries__item"
        >
          <template #default="{ queryHTML }">
            <!-- eslint-disable max-len -->
            <!--
              @slot History Query content
                  @binding {Suggestion} suggestion - History Query suggestion data
                  @binding {string} queryHTML - Suggestion's query with the matching part inside a span tag
                  @binding {number} index - History Query suggestion index
            -->
            <!-- eslint-enable max-len -->
            <slot name="suggestion-content" v-bind="{ suggestion, index, queryHTML }" />
          </template>
          <template #remove-button-content>
            <!--
              @slot History Query remove button content
                  @binding {Suggestion} suggestion - History Query suggestion data
                  @binding {number} index - History Query suggestion index
            -->
            <slot name="suggestion-remove-content" v-bind="{ suggestion, index }" />
          </template>
        </HistoryQuery>
      </slot>
    </template>
  </BaseSuggestions>
</template>

<script lang="ts">
  import { HistoryQuery as HistoryQueryModel } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import BaseSuggestions from '../../../components/suggestions/base-suggestions.vue';
  import { Getter } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { historyQueriesXModule } from '../x-module';
  import HistoryQuery from './history-query.vue';

  /**
   * This component renders a list of suggestions coming from the user queries history.
   *
   * @remarks
   *
   * Allows the user to select one of them, emitting the needed events.
   * A history query is just another type of suggestion that contains a query that the user has
   * made in the past.
   *
   * @public
   */
  @Component({
    components: { BaseSuggestions, HistoryQuery },
    mixins: [xComponentMixin(historyQueriesXModule)]
  })
  export default class HistoryQueries extends Vue {
    /**
     * Animation component that will be used to animate the suggestions.
     *
     * @public
     */
    @Prop()
    protected animation!: Vue;

    /**
     * Maximum number of history queries to show. It should be a lower number than the
     * {@link HistoryQueriesConfig.maxItemsToStore}. If it is not provided, it will show
     * all the stored `HistoryQueries`.
     */
    @Prop()
    protected maxItemsToRender?: number;

    /**
     * The filtered list of history queries.
     *
     * @internal
     */
    @Getter('historyQueries', 'historyQueries')
    public historyQueries!: HistoryQueryModel[];
  }
</script>

<docs lang="mdx">
## Events

This component doesn't emit events.

## See it in action

Here you have a basic example of how the HistoryQueries is rendered.

```vue
<template>
  <HistoryQueries />
</template>

<script>
  import { HistoryQueries } from '@empathyco/x-components/history-queries';

  export default {
    name: 'HistoryQueriesDemo',
    components: {
      HistoryQueries
    }
  };
</script>
```

### Play with props

In this example, the history queries has been limited to render a maximum of 10 queries (by default
it is 5).

```vue
<template>
  <HistoryQueries :maxItemsToRender="10" />
</template>

<script>
  import { HistoryQueries } from '@empathyco/x-components/history-queries';

  export default {
    name: 'HistoryQueriesDemo',
    components: {
      HistoryQueries
    }
  };
</script>
```

### Play with the animation

```vue
<template>
  <HistoryQueries :animation="fadeAndSlide" />
</template>

<script>
  import { HistoryQueries } from '@empathyco/x-components/history-queries';
  import { FadeAndSlide } from '@empathyco/x-components/animations';

  export default {
    name: 'HistoryQueriesDemo',
    components: {
      HistoryQueries
    },
    data() {
      return {
        fadeAndSlide: FadeAndSlide
      };
    }
  };
</script>
```

### Play with suggestion slot

In this example, the [`HistoryQuery`](./x-components.history-query.md) component is passed in the
`suggestion` slot (although any other component could potentially be passed).

```vue
<template>
  <HistoryQueries #suggestion="{ suggestion }">
    <HistoryQuery :suggestion="suggestion"></HistoryQuery>
  </HistoryQueries>
</template>

<script>
  import { HistoryQueries, HistoryQuery } from '@empathyco/x-components/history-queries';

  export default {
    name: 'HistoryQueriesDemo',
    components: {
      HistoryQueries,
      HistoryQuery
    }
  };
</script>
```

### Play with suggestion-content slot

To continue the previous example, the [`HistoryQuery`](./x-components.history-query.md) component is
passed in the `suggestion-content` slot, but in addition, an HTML span tag for the text are also
passed.

```vue
<template>
  <HistoryQueries #suggestion-content="{ suggestion }">
    <span>{{ suggestion.query }}</span>
  </HistoryQueries>
</template>

<script>
  import { HistoryQueries } from '@empathyco/x-components/history-queries';

  export default {
    name: 'HistoryQueriesDemo',
    components: {
      HistoryQueries
    }
  };
</script>
```

### Play with suggestion-content-remove slot

To continue the previous example, the [`HistoryQuery`](./x-components.history-query.md) component is
passed in the `suggestion-content` slot, but in addition, a cross icon is also passed to change the
icon to remove the history query.

```vue
<template>
  <HistoryQueries #suggestion-content-remove="{ suggestion }">
    <CrossIcon />
  </HistoryQueries>
</template>

<script>
  import { HistoryQueries } from '@empathyco/x-components/history-queries';
  import { CrossIcon } from '@empathyco/x-components';

  export default {
    name: 'HistoryQueriesDemo',
    components: {
      HistoryQueries,
      CrossIcon
    }
  };
</script>
```
</docs>
