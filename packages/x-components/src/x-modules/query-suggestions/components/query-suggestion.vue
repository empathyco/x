<template>
  <BaseSuggestion
    v-bind="{ query, suggestion, suggestionSelectedEvents: event }"
    class="x-query-suggestion"
    data-test="query-suggestion"
    feature="query_suggestion"
    #default="baseScope"
  >
    <!-- eslint-disable max-len -->
    <!--
        @slot Query Suggestion content
          @binding {Object} v-bind - `BaseSuggestion` default slot scope: **suggestion** <code>Suggestion</code> - Suggestion data<br /> **query** <code>string</code> - The query that the suggestion belongs to<br /> **filter** <code>Filter \| undefined</code> - Suggestion's filter
    -->
    <!-- eslint-enable max-len -->
    <slot v-bind="{ ...baseScope }" />
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

```vue live
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
          query: 'tshirt',
          facets: []
        }
      };
    }
  };
</script>
```

### Play with default slot

In this example, we are adding an emoji next to the suggestion.

```vue live
<template>
  <QuerySuggestion :suggestion="suggestion" #default="{ suggestion }">
    <span>🔍</span>
    <span>{{ suggestion.query }}</span>
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
          query: 'tshirt',
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

```vue live
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
          query: 'tshirt',
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
