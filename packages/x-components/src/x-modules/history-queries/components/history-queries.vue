<template>
  <BaseSuggestions
    v-bind="$attrs"
    :suggestions="historyQueries"
    class="x-history-queries"
    data-test="history-queries"
  >
    <template #default="props">
      <!-- eslint-disable max-len -->
      <!--
        @slot History Query item
            @binding {DirectiveFunction} v-bind - History Query suggestion attributes defined in [`BaseSuggestions`](./x-components.base-suggestions.md#slots) default slot
      -->
      <!-- eslint-enable max-len -->
      <slot name="suggestion" v-bind="{ ...props }">
        <HistoryQuery
          :suggestion="props.suggestion"
          data-test="history-query-item"
          class="x-history-queries__item"
        >
          <template #default="{ suggestion, queryHTML }">
            <!-- eslint-disable max-len -->
            <!--
              @slot History Query content
                  @binding {DirectiveFunction} v-bind - History Query suggestion attributes defined in [`BaseSuggestions`](./x-components.base-suggestions.md#slots) default slot
                  @binding {Suggestion} suggestion - History Query suggestion data
                  @binding {string} queryHTML - Suggestion's query with the matching part inside a span tag
            -->
            <!-- eslint-enable max-len -->
            <slot name="suggestion-content" v-bind="{ ...props, suggestion, queryHTML }" />
          </template>
          <template #remove-button-content="{ suggestion }">
            <!-- eslint-disable max-len -->
            <!--
              @slot History Query remove button content
                  @binding {DirectiveFunction} v-bind - History Query suggestion attributes defined in [`BaseSuggestions`](./x-components.base-suggestions.md#slots) default slot
                  @binding {Suggestion} suggestion - History Query suggestion data
            -->
            <!-- eslint-enable max-len -->
            <slot name="suggestion-remove-content" v-bind="{ ...props, suggestion }" />
          </template>
        </HistoryQuery>
      </slot>
    </template>
  </BaseSuggestions>
</template>

<script lang="ts">
  import { HistoryQuery as HistoryQueryModel } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BaseSuggestions from '../../../components/suggestions/base-suggestions.vue';
  import { Getter } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { historyQueriesXModule } from '../x-module';
  import HistoryQuery from './history-query.vue';

  /**
   * This component renders a list of suggestions coming from the user queries history.
   * Allows the user to select one of them, emitting the needed events. A history query is just
   * another type of suggestion that contains a query that the user has made in the past.
   *
   * This component uses the [`BaseSuggestions`](./x-components.base-suggestions.md) component
   * and inherits its attributes.
   * Check `BaseSuggestions` [Props section](./x-components.base-suggestions.md#Props) and
   * [Slots section](./x-components.base-suggestions.md#Slots) for further information.
   *
   * @public
   */
  @Component({
    components: { BaseSuggestions, HistoryQuery },
    mixins: [xComponentMixin(historyQueriesXModule)]
  })
  export default class HistoryQueries extends Vue {
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

```vue live
<template>
  <div>
    <SearchInput />
    <HistoryQueries />
  </div>
</template>

<script>
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { HistoryQueries } from '@empathyco/x-components/history-queries';

  export default {
    name: 'HistoryQueriesDemo',
    components: {
      SearchInput,
      HistoryQueries
    }
  };
</script>
```

### Play with props

In this example, the history queries have been limited to render a maximum of 10 queries (by default
it is 5).

```vue live
<template>
  <div>
    <SearchInput />
    <HistoryQueries :maxItemsToRender="10" />
  </div>
</template>

<script>
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { HistoryQueries } from '@empathyco/x-components/history-queries';

  export default {
    name: 'HistoryQueriesDemo',
    components: {
      SearchInput,
      HistoryQueries
    }
  };
</script>
```

### Play with the animation

```vue live
<template>
  <div>
    <SearchInput />
    <HistoryQueries :animation="'FadeAndSlide'" />
  </div>
</template>

<script>
  import Vue from 'vue';
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { HistoryQueries } from '@empathyco/x-components/history-queries';
  import { FadeAndSlide } from '@empathyco/x-components';

  // Registering the animation as a global component
  Vue.component('FadeAndSlide', FadeAndSlide);
  export default {
    name: 'HistoryQueriesDemo',
    components: {
      SearchInput,
      HistoryQueries
    }
  };
</script>
```

### Play with suggestion slot

In this example, the [`HistoryQuery`](./x-components.history-query.md) component is passed in the
`suggestion` slot (although any other component could potentially be passed).

```vue live
<template>
  <div>
    <SearchInput />
    <HistoryQueries #suggestion="{ suggestion }">
      <HistoryQuery :suggestion="suggestion" />
    </HistoryQueries>
  </div>
</template>

<script>
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { HistoryQueries, HistoryQuery } from '@empathyco/x-components/history-queries';

  export default {
    name: 'HistoryQueriesDemo',
    components: {
      SearchInput,
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

```vue live
<template>
  <div>
    <SearchInput />
    <HistoryQueries #suggestion-content="{ suggestion }">
      <span>{{ suggestion.query }}</span>
    </HistoryQueries>
  </div>
</template>

<script>
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { HistoryQueries } from '@empathyco/x-components/history-queries';

  export default {
    name: 'HistoryQueriesDemo',
    components: {
      SearchInput,
      HistoryQueries
    }
  };
</script>
```

### Play with suggestion-content-remove slot

To continue the previous example, the [`HistoryQuery`](./x-components.history-query.md) component is
passed in the `suggestion-content` slot, but in addition, a cross icon is also passed to change the
icon to remove the history query.

```vue live
<template>
  <div>
    <SearchInput />
    <HistoryQueries #suggestion-remove-content="{ suggestion }">
      <CrossIcon />
    </HistoryQueries>
  </div>
</template>

<script>
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { HistoryQueries } from '@empathyco/x-components/history-queries';
  import { CrossIcon } from '@empathyco/x-components';

  export default {
    name: 'HistoryQueriesDemo',
    components: {
      SearchInput,
      HistoryQueries,
      CrossIcon
    }
  };
</script>
```
</docs>
