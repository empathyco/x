<template>
  <BaseSuggestions
    :suggestions="historyQueries"
    class="x-my-history-queries"
    data-test="my-history-queries"
    :animation="animation"
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
  import { HistoryQuery } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State, xComponentMixin } from '../../../components';
  import BaseSuggestions from '../../../components/suggestions/base-suggestions.vue';
  import { historyQueriesXModule } from '../x-module';
  import HistoryQueryComponent from './history-query.vue';

  /**
   * This component renders the complete list of suggestions coming from the user queries history.
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
    components: { HistoryQuery: HistoryQueryComponent, BaseSuggestions },
    mixins: [xComponentMixin(historyQueriesXModule)]
  })
  export default class MyHistory extends Vue {
    /**
     * Animation component that will be used to animate the suggestions.
     *
     * @public
     */
    @Prop()
    protected animation!: Vue;

    /**
     * The list of history queries.
     *
     * @internal
     */
    @State('historyQueries', 'historyQueries')
    public historyQueries!: HistoryQuery[];
  }
</script>

<docs lang="mdx">
## Events

This component doesn't emit events.

## See it in action

Here you have a basic example of how the MyHistory is rendered.

```vue
<template>
  <MyHistory />
</template>

<script>
  import { MyHistory } from '@empathyco/x-components/history-queries';

  export default {
    name: 'MyHistoryDemo',
    components: {
      MyHistory
    }
  };
</script>
```

### Play with the animation

```vue
<template>
  <MyHistory :animation="fadeAndSlide" />
</template>

<script>
  import { MyHistory } from '@empathyco/x-components/history-queries';
  import { FadeAndSlide } from '@empathyco/x-components/animations';

  export default {
    name: 'MyHistoryDemo',
    components: {
      MyHistory
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
  <MyHistory #suggestion="{ suggestion }">
    <HistoryQuery :suggestion="suggestion"></HistoryQuery>
  </MyHistory>
</template>

<script>
  import { MyHistory, HistoryQuery } from '@empathyco/x-components/history-queries';

  export default {
    name: 'MyHistoryDemo',
    components: {
      MyHistory,
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
  <MyHistory #suggestion-content="{ suggestion }">
    <span>{{ suggestion.query }}</span>
  </MyHistory>
</template>

<script>
  import { MyHistory } from '@empathyco/x-components/history-queries';

  export default {
    name: 'MyHistoryDemo',
    components: {
      MyHistory
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
  <MyHistory #suggestion-content-remove="{ suggestion }">
    <CrossIcon />
  </MyHistory>
</template>

<script>
  import { MyHistory } from '@empathyco/x-components/history-queries';
  import { CrossIcon } from '@empathyco/x-components';

  export default {
    name: 'MyHistoryDemo',
    components: {
      MyHistory,
      CrossIcon
    }
  };
</script>
```
</docs>
