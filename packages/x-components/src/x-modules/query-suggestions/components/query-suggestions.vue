<template>
  <BaseSuggestions
    :suggestions="suggestions"
    class="x-query-suggestions"
    data-test="query-suggestions"
    :animation="animation"
  >
    <template #default="{ suggestion, index }">
      <!--
        @slot Custom component that replaces the `QuerySuggestion` component
            @binding {Suggestion} suggestion - Query Suggestion data
            @binding {number} index - Query Suggestion index
      -->
      <slot name="suggestion" v-bind="{ suggestion, index }">
        <QuerySuggestion :suggestion="suggestion" class="x-query-suggestions__suggestion">
          <template #default="{ queryHTML }">
            <!-- eslint-disable max-len -->
            <!--
              @slot Custom content that replaces the `QuerySuggestion` default content
                  @binding {Suggestion} suggestion - Query Suggestion data
                  @binding {string} queryHTML - Suggestion’s query with the matching part wrapped in a HTML span tag
                  @binding {number} index - Query Suggestion index
            -->
            <!-- eslint-enable max-len -->
            <slot name="suggestion-content" v-bind="{ suggestion, index, queryHTML }" />
          </template>
        </QuerySuggestion>
      </slot>
    </template>
  </BaseSuggestions>
</template>

<script lang="ts">
  import { Suggestion } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import BaseSuggestions from '../../../components/suggestions/base-suggestions.vue';
  import { Getter } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { querySuggestionsXModule } from '../x-module';
  import QuerySuggestion from './query-suggestion.vue';

  /**
   * This component renders a list of possible search queries to select from as a query is entered
   * in the input field. By default, this is a list of
   * [`QuerySuggestion`](./x-components.query-suggestion.md) components.
   *
   * @public
   */
  @Component({
    components: { BaseSuggestions, QuerySuggestion },
    mixins: [xComponentMixin(querySuggestionsXModule)]
  })
  export default class QuerySuggestions extends Vue {
    /**
     * The module's list of suggestions.
     *
     * @internal
     */
    @Getter('querySuggestions', 'querySuggestions')
    public suggestions!: Suggestion[];

    /**
     * Animation component for `QuerySuggestions`.
     *
     * @public
     */
    @Prop()
    protected animation!: Vue;
  }
</script>

<docs lang="mdx">
## See it in action

<!-- prettier-ignore-start -->
:::warning Backend microservice required
To use this component, the <b>Empathize</b> microservice must be
implemented.
:::
<!-- prettier-ignore-end -->

In this example, a list of query suggestions is displayed. See how the suggestions change as you
type “puzzle”. If you click on a suggestion, the search term in the search input is updated and the
query suggestions are changed to reflect the new search term.

_Type “puzzle” or another toy in the input field to try it out!_

```vue
<template>
  <div>
    <SearchInput />
    <QuerySuggestions />
  </div>
</template>

<script>
  import { QuerySuggestions } from '@empathyco/x-components/query-suggestions';
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'QuerySuggestionsDemo',
    components: {
      QuerySuggestions,
      SearchInput
    }
  };
</script>
```

### Play with props

In this example, an `StaggeredFadeAndSlide` animation component has been passed as prop, so that the
matching query suggestions are shuffled with a slight delay as more letters of the term are typed.

_Type “puzzle” or another toy in the input field to try it out!_

```vue
<template>
  <div>
    <SearchInput />
    <QuerySuggestions animation="StaggeredFadeAndSlide" />
  </div>
</template>

<script>
  import { QuerySuggestions } from '@empathyco/x-components/query-suggestions';
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { StaggeredFadeAndSlide } from '@empathyco/x-components';

  // Register the animation as a global component
  Vue.component('StaggeredFadeAndSlide', StaggeredFadeAndSlide);
  export default {
    name: 'QuerySuggestionsDemo',
    components: {
      QuerySuggestions,
      SearchInput
    }
  };
</script>
```

### Play with suggestion slot

Here, the `suggestion` binding property passes the suggestion data.

_Type “puzzle” or another toy in the input field to try it out!_

```vue
<template>
  <div>
    <SearchInput />
    <QuerySuggestions #suggestion="{ suggestion }">
      <QuerySuggestion :suggestion="suggestion" #default="{ queryHTML }">
        <span v-html="queryHTML" />
      </QuerySuggestion>
    </QuerySuggestions>
  </div>
</template>

<script>
  import { QuerySuggestion, QuerySuggestions } from '@empathyco/x-components/query-suggestions';

  export default {
    name: 'QuerySuggestionsDemo',
    components: {
      QuerySuggestion,
      QuerySuggestions
    }
  };
</script>
```

<!-- prettier-ignore-start -->
::: danger
If you're not using the [`QuerySuggestion`](./query-suggestion.md) component, then
you must implement the `UserAcceptedAQuery` and `UserSelectedAQuerySuggestion` events in
`QuerySuggestions`.

```vue
<template>
  <div>
    <SearchInput />
    <QuerySuggestions #suggestion="{ suggestion }">
      <button @click="emitSuggestionClickedEvents($event, suggestion)">
        {{ suggestion.query }}
      </button>
    </QuerySuggestions>
  </div>
</template>

<script>
  import { QuerySuggestions } from '@empathyco/x-components/query-suggestions';
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'QuerySuggestionsDemo',
    components: {
      SearchInput,
      QuerySuggestions
    },
    methods: {
      emitSuggestionClickedEvents(event, suggestion) {
        this.$x.emit('UserAcceptedAQuery', suggestion.query, {
          target: event.target
        });
        this.$x.emit('UserSelectedASuggestion', suggestion, {
          target: event.target
        });
        this.$x.emit('UserSelectedAQuerySuggestion', suggestion, {
          target: event.target
        });
      }
    }
  };
</script>
```

:::
<!-- prettier-ignore-end -->

### Play with suggestion-content slot

In this example, the `suggestion` and `queryHTML` bindings have been passed in the
`suggestion-content` slot to paint the resulting query suggestions in blue.

_Type “puzzle” or another toy in the input field to try it out!_

```vue
<template>
  <div>
    <SearchInput />
    <QuerySuggestions #suggestion-content="{ suggestion, queryHTML }">
      <span :aria-label="`Select ${suggestion.query}`" style="color: blue;" v-html="queryHTML" />
    </QuerySuggestions>
  </div>
</template>

<script>
  import { QuerySuggestions } from '@empathyco/x-components/query-suggestions';
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'QuerySuggestionsDemo',
    components: {
      SearchInput,
      QuerySuggestions
    }
  };
</script>
```

## Extending the component

Components can be combined and communicate with each other. Commonly, the `QuerySuggestions`
component communicates with the [`SearchInput`](../search-box/x-components.search-input.md),
updating the term in the search input.

_Type “puzzle” or another toy in the input field to try it out!_

```vue
<template>
  <div>
    <SearchInput />
    <QuerySuggestions />
  </div>
</template>

<script>
  import { QuerySuggestions } from '@empathyco/x-components/query-suggestions';
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'QuerySuggestionsDemo',
    components: {
      SearchInput,
      QuerySuggestions
    }
  };
</script>
```
</docs>
