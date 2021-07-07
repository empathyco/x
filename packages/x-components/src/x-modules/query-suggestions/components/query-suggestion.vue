<template>
  <BaseSuggestion
    v-bind="{ query, suggestion, suggestionSelectedEvents: event }"
    :aria-label="suggestion.query"
    class="x-query-suggestion"
    data-test="query-suggestion"
  >
    <template #default="{ suggestion, queryHTML }">
      <!-- eslint-disable max-len -->
      <!--
        @slot Custom content that replaces the `QuerySuggestion` default content
            @binding {Suggestion} suggestion - Query Suggestion data
            @binding {string} queryHTML - Suggestion’s query with the matching part wrapped in a HTML span tag
      -->
      <!-- eslint-enable max-len -->
      <slot v-bind="{ suggestion, queryHTML }" />
    </template>
  </BaseSuggestion>
</template>

<script lang="ts">
  import { Suggestion } from '@empathyco/x-types';
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import BaseSuggestion from '../../../components/suggestions/base-suggestion.vue';
  import { Getter } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { querySuggestionsXModule } from '../x-module';

  /**
   * This component renders a suggestion for a query. A query suggestion is a recommended query
   * based on previous search queries. It contains the query itself and a set of filters associated.
   * For example, if you're searching for _shirt_, a query suggestion could be _long sleeve shirt_.
   *
   * @public
   */
  @Component({
    components: { BaseSuggestion },
    mixins: [xComponentMixin(querySuggestionsXModule)]
  })
  export default class QuerySuggestion extends Vue {
    /**
     * The normalized query of the query-suggestions module.
     *
     * @internal
     */
    @Getter('querySuggestions', 'normalizedQuery')
    public query!: string;

    /**
     * The suggestion to render.
     *
     * @public
     */
    @Prop({ required: true })
    protected suggestion!: Suggestion;

    /**
     * Emits {@link QuerySuggestionsXEvents.UserSelectedAQuerySuggestion} with the suggestion as
     * payload when selecting the query suggestion.
     *
     * @internal
     */
    protected event: Partial<XEventsTypes> = {
      UserSelectedAQuerySuggestion: this.suggestion
    };
  }
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserSelectedAQuerySuggestion`] (./../../api/x-components.querysuggestionsxevents.md)

## See it in action

<!-- prettier-ignore-start -->
:::warning Backend microservice required
To use this component, the <b>Empathize</b> microservice must be
implemented.
:::
<!-- prettier-ignore-end -->

Here you can see how a single query suggestion is rendered using the `suggestion` prop.

```vue
<template>
  <QuerySuggestion :suggestion="suggestion" />
</template>

<script>
  import { QuerySuggestion } from '@empathyco/x-components/query-suggestions';
  export default {
    name: 'QuerySuggestionDemo',
    components: {
      QuerySuggestion
    },
    data() {
      return {
        suggestion: {
          modelName: 'QuerySuggestion',
          query: 'beer',
          facets: []
        }
      };
    }
  };
</script>
```

### Play with default slot

In this example, the query suggestion is painted in blue by passing a color style in the HTML span
element.

```vue
<template>
  <QuerySuggestion :suggestion="suggestion" #default="{ queryHTML }">
    <span v-html="queryHTML" style="color: blue;" />
  </QuerySuggestion>
</template>

<script>
  import { QuerySuggestion } from '@empathyco/x-components/query-suggestions';
  export default {
    name: 'QuerySuggestionDemo',
    components: {
      QuerySuggestion
    },
    data() {
      return {
        suggestion: {
          modelName: 'QuerySuggestion',
          query: 'beer',
          facets: []
        }
      };
    }
  };
</script>
```

### Play with events

In this example, when you click on the query suggestion, a message is displayed to illustrate that
the `UserSelectedAQuerySuggestion` event has been triggered.

```vue
<template>
  <QuerySuggestion :suggestion="suggestion" @UserSelectedAQuerySuggestion="alertSuggestion" />
</template>

<script>
  import { QuerySuggestion } from '@empathyco/x-components/query-suggestions';
  export default {
    name: 'QuerySuggestionDemo',
    components: {
      QuerySuggestion
    },
    data() {
      return {
        suggestion: {
          modelName: 'QuerySuggestion',
          query: 'beer',
          facets: []
        }
      };
    },
    methods: {
      alertSuggestion(querySuggestion) {
        alert(`You have clicked the query suggestion: ${querySuggestion.query}`);
      }
    }
  };
</script>
```
</docs>
