<template>
  <component :is="animation" v-if="hasHistoryQueries" class="x-my-history x-list" tag="ul">
    <li
      v-for="(historyQueries, date) in groupByDate"
      :key="date"
      class="x-my-history-item"
      data-test="my-history-item"
    >
      <slot name="date" :date="date">
        <span class="x-my-history-item__date" data-test="my-history-date">{{ date }}</span>
      </slot>
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
              <template #default>
                <!--
              @slot History Query content
                  @binding {Suggestion} suggestion - History Query suggestion data
                  @binding {number} index - History Query suggestion index
            -->
                <slot name="suggestion-content" v-bind="{ suggestion, index, formatTime }">
                  <div class="x-list x-list--vertical">
                    <span>{{ suggestion.query }}</span>
                    <span>{{ formatTime(suggestion.timestamp) }}</span>
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
  </component>
</template>

<script lang="ts">
  import { HistoryQuery } from '@empathyco/x-types';
  import { Dictionary } from '@empathyco/x-utils';
  import Vue from 'vue';
  import { Component, Inject, Prop } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { State } from '../../../components/decorators/store.decorators';
  import BaseSuggestions from '../../../components/suggestions/base-suggestions.vue';
  import { groupItemsBy, isArrayEmpty } from '../../../utils/array';
  import { SnippetConfig } from '../../../x-installer/api/api.types';
  import { historyQueriesXModule } from '../x-module';
  import HistoryQueryComponent from './history-query.vue';

  /**
   * The component renders the full history of user searched queries grouped by the day
   * they were performed.
   *
   * @remarks
   *
   * Allows the user to select one of them, emitting the needed events.
   * A history query is just another type of suggestion that contains a query that the user has
   * made in the past.
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
    @Prop({ default: 'ul' })
    protected animation!: Vue | string;

    /**
     * The current locale.
     *
     * @public
     */
    @Prop({ default: 'en' })
    protected locale!: string;

    /**
     * The list of history queries.
     *
     * @internal
     */
    @State('historyQueries', 'historyQueries')
    public historyQueries!: HistoryQuery[];

    /**
     * The provided {@link SnippetConfig}.
     *
     * @internal
     */
    @Inject('snippetConfig')
    public snippetConfig?: SnippetConfig;

    /**
     * Returns a record of history queries grouped by date.
     *
     * @example
     * ```typescript
     *  const historyQueriesGrouped = {
     *    'Monday, January 10th, 2022' : [{
     *      query: 'lego',
     *      modelName: 'HistoryQuery',
     *      timestamp: 121312312
     *    }],
     *    'Tuesday, January 11th, 2022' : [{
     *      query: 'barbie',
     *      modelName: 'HistoryQuery',
     *      timestamp: 15221212
     *    }]
     *  }
     * ```
     * @returns The history queries grouped by date.
     * @internal
     */
    protected get groupByDate(): Dictionary<HistoryQuery[]> {
      return groupItemsBy(this.historyQueries, current => {
        return new Date(current.timestamp).toLocaleDateString(this.usedLocale, {
          day: 'numeric',
          weekday: 'long',
          month: 'long',
          year: 'numeric'
        });
      });
    }

    /**
     * Formats a timestamp into `hh:mm [PM/AM]` format.
     *
     * @example
     * ```typescript
     * // locale 'es'
     * console.log(formatTime(Date.now()) // '16:54'.
     *
     * // locale 'en'
     * console.log(formatTime(Date.now()) // '16:54 PM'.
     * ```
     * @param timestamp - The timestamp to format.
     * @returns The formatted time.
     * @internal
     */
    protected formatTime(timestamp: number): string {
      return new Date(timestamp).toLocaleTimeString(this.usedLocale, {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    /**
     * The `hasHistoryQueries` computed property is a flag representing if there are history queries
     * stored.
     *
     * @returns True if there are history queries; false otherwise.
     * @internal
     */
    protected get hasHistoryQueries(): boolean {
      return !isArrayEmpty(this.historyQueries);
    }
    /**
     * The locale that it is going to be used. It can be the one send it by the snippet config or
     * the one pass it using the prop.
     *
     * @returns The locale to be used.
     * @internal
     */
    protected get usedLocale(): string {
      return this.snippetConfig?.lang ?? this.locale;
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

### Play with props

In this example, the my history has been configured to use the 'es' locale.

```vue
<template>
  <MyHistory :locale="es" />
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

### Play with suggestion-content slot

In this example, an HTML span tag for the date are passed.

```vue
<template>
  <MyHistory #date="{ date }">
    <span>{{ date }}</span>
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
