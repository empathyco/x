<template>
  <ul v-if="historyQueries.length > 0" class="x-my-history x-list">
    <li
      v-for="(list, date) in historyQueriesGroupByDate"
      :key="date"
      class="x-my-history-item"
      data-test="my-history-item"
    >
      <span class="x-my-history-item__date" data-test="my-history-date">{{ date }}</span>
      <BaseSuggestions
        :suggestions="list"
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
              <template #default>
                <!-- eslint-disable max-len -->
                <!--
              @slot History Query content
                  @binding {Suggestion} suggestion - History Query suggestion data
                  @binding {number} index - History Query suggestion index
            -->
                <!-- eslint-enable max-len -->
                <slot name="suggestion-content" v-bind="{ suggestion, index }">
                  <HistoryTiny class="x-icon--l" />
                  <div class="x-list x-list--vertical">
                    <span data-test="my-history-query">{{ suggestion.query }}</span>
                    <span data-test="my-history-time">{{ formatTime(suggestion.timestamp) }}</span>
                  </div>
                </slot>
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
    </li>
  </ul>
</template>

<script lang="ts">
  import { HistoryQuery } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Inject, Prop } from 'vue-property-decorator';
  import HistoryTiny from '../../../components/icons/history-tiny.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { State } from '../../../components/decorators/store.decorators';
  import BaseSuggestions from '../../../components/suggestions/base-suggestions.vue';
  import { groupItemsBy } from '../../../utils/index';
  import { SnippetConfig } from '../../../x-installer/index';
  import { historyQueriesXModule } from '../x-module';
  import HistoryQueryComponent from './history-query.vue';

  /**
   * This component renders the complete list of suggestions group by date that are coming from the
   * user queries history.
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
    components: { HistoryTiny, HistoryQuery: HistoryQueryComponent, BaseSuggestions },
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

    /**
     * It injects {@link SnippetConfig} provided by an ancestor as snippetConfig.
     *
     * @internal
     */
    @Inject('snippetConfig')
    public snippetConfig!: SnippetConfig;

    /**
     * Returns history queries group by date.
     *
     * @example
     * ```typescript
     *  const historyQueriesGrouped = \{
     *    "Monday, January 10th, 2022" : [
     *      \{
     *        query: 'lego',
     *        modelName: 'HistoryQuery',
     *        timestamp: 121312312
     *      \}
     *    ],
     *     "Tuesday, January 11th, 2022" : [
     *      \{
     *        query: 'barbie',
     *        modelName: 'HistoryQuery',
     *        timestamp: 15221212
     *      \}
     *    ]
     *  \}
     * ```
     *
     * @returns HistoryQueries - The history queries grouped by date.
     *
     * @internal
     */
    public get historyQueriesGroupByDate(): Record<string, HistoryQuery[]> {
      return groupItemsBy(this.historyQueries, current => {
        return new Date(current.timestamp).toLocaleDateString(this.snippetConfig.lang, {
          day: 'numeric',
          weekday: 'long',
          month: 'long',
          year: 'numeric'
        });
      });
    }

    /**
     * Format a timestamp to be a time in format 12 hours and using PM/AM.
     *
     * @example '01:23 PM'.
     *
     * @param timestamp - The history query timestamp.
     *
     * @returns Time - The formatted time.
     *
     * @internal
     */
    protected formatTime(timestamp: number): string {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
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
  import { FadeAndSlide } from '@empathyco/x-components';

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
