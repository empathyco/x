<template>
  <div class="x-suggestion-group x-history-query">
    <BaseSuggestion
      class="x-history-query__suggestion"
      v-bind="{ suggestion, suggestionSelectedEvents, query }"
      data-test="history-query"
      feature="history_query"
    >
      <template #default="{ suggestion, queryHTML }">
        <!-- eslint-disable max-len -->
        <!--
          @slot History Query content
              @binding {Suggestion} suggestion - History Query suggestion data
              @binding {string} queryHTML - Suggestion's query with the matching part inside a span tag
        -->
        <!-- eslint-enable max-len -->
        <slot v-bind="{ suggestion, queryHTML }" />
      </template>
    </BaseSuggestion>
    <RemoveHistoryQuery
      class="x-history-query__remove"
      :historyQuery="suggestion"
      data-test="remove-history-query"
      aria-label="remove"
    >
      <!--
          @slot History Query remove button content
              @binding {Suggestion} suggestion - History Query suggestion data
        -->
      <slot name="remove-button-content" v-bind="{ suggestion }">✕</slot>
    </RemoveHistoryQuery>
  </div>
</template>

<script lang="ts">
  import { HistoryQuery as HistoryQueryModel } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Getter } from '../../../components/decorators/store.decorators';
  import BaseSuggestion from '../../../components/suggestions/base-suggestion.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { historyQueriesXModule } from '../x-module';
  import RemoveHistoryQuery from './remove-history-query.vue';

  /**
   * This component renders a history query suggestion combining two buttons: one for selecting this
   * suggestion as the search query, and another one to remove this query suggestion from the
   * history queries.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(historyQueriesXModule)],
    components: { RemoveHistoryQuery, BaseSuggestion }
  })
  export default class HistoryQuery extends Vue {
    /**
     * The history query suggestion to render.
     *
     * @public
     */
    @Prop({ required: true })
    protected suggestion!: HistoryQueryModel;

    /**
     * The normalized query of the history-queries module.
     *
     * @internal
     */
    @Getter('historyQueries', 'normalizedQuery')
    public query!: string;

    /**
     * The list of events that are going to be emitted when the suggestion button is pressed.
     *
     * @internal
     * @returns The {@link XEvent | XEvents} to emit.
     */
    protected get suggestionSelectedEvents(): Partial<XEventsTypes> {
      return {
        UserSelectedAHistoryQuery: this.suggestion
      };
    }
  }
</script>

<docs lang="mdx">
## Examples

### Basic usage

This component only requires a prop called `suggestion`

```vue live
<template>
  <HistoryQuery :suggestion="suggestion" />
</template>

<script>
  import { HistoryQuery } from '@empathyco/x-components/history-queries';
  export default {
    name: 'HistoryQueryDemo',
    components: {
      HistoryQuery
    },
    data() {
      return {
        suggestion: {
          modelName: 'HistoryQuery',
          query: 'trousers',
          facets: []
        }
      };
    }
  };
</script>
```

### Customizing slots content

Suggestion and remove buttons contents can be customized.

The default slot allows you to replace the content of the suggestion button. It has two properties,
the suggestion itself, and a `string` of HTML with the matched query.

The other slot is called `remove-button-content`, and allows you to set the content of the button
that serves to remove this query from the history. This slot only has one property, the suggestion.

```vue live
<template>
  <HistoryQuery :suggestion="suggestion">
    <template #default="{ suggestion, queryHTML }">
      <HistoryIcon />
      <span class="x-history-query__matching-part" v-html="queryHTML" />
    </template>

    <template #remove-button-content="{ suggestion }">
      <CrossIcon />
    </template>
  </HistoryQuery>
</template>

<script>
  import { HistoryQuery } from '@empathyco/x-components/history-queries';
  import { HistoryIcon, CrossIcon } from '@empathyco/x-components';

  export default {
    name: 'HistoryQueryDemo',
    components: {
      HistoryQuery,
      HistoryIcon,
      CrossIcon
    },
    data() {
      return {
        suggestion: {
          modelName: 'HistoryQuery',
          query: 'trousers',
          facets: []
        }
      };
    }
  };
</script>
```

## Events

A list of events that the component will emit:

- `UserSelectedAHistoryQuery`: the event is emitted after the user clicks the button. The event
  payload is the history query data.
</docs>
