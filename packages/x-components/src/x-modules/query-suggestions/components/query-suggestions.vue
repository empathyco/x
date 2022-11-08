<template>
  <BaseSuggestions
    v-bind="$attrs"
    :suggestions="suggestions"
    class="x-query-suggestions"
    data-test="query-suggestions"
  >
    <template #default="props">
      <!-- eslint-disable max-len -->
      <!--
        @slot Custom content that replaces the `QuerySuggestion` default content
            @binding {Suggestion} suggestion - Query Suggestion bindings defined in [`BaseSuggestions`](./x-components.base-suggestions.md#slots) default slot
      -->
      <!-- eslint-enable max-len -->
      <slot name="suggestion" v-bind="{ ...props }">
        <QuerySuggestion :suggestion="props.suggestion" class="x-query-suggestions__suggestion">
          <template #default="{ suggestion, queryHTML }">
            <!-- eslint-disable max-len -->
            <!--
              @slot Custom content that replaces the `QuerySuggestion` default content
                  @binding {Suggestion} suggestion - Query Suggestion bindings defined in [`BaseSuggestions`](./x-components.base-suggestions.md#slots) default slot
                  @binding {string} queryHTML - Suggestion’s query with the matching part wrapped in a HTML span tag
            -->
            <!-- eslint-enable max-len -->
            <slot name="suggestion-content" v-bind="{ ...props, suggestion, queryHTML }" />
          </template>
        </QuerySuggestion>
      </slot>
    </template>
  </BaseSuggestions>
</template>

<script lang="ts">
  import { Suggestion } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BaseSuggestions from '../../../components/suggestions/base-suggestions.vue';
  import { Getter } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { querySuggestionsXModule } from '../x-module';
  import QuerySuggestion from './query-suggestion.vue';

  /**
   * This component renders a [`BaseSuggestions`](./x-components.base-suggestions.md) list of
   * possible search queries to select from as a query is entered in the input field. By
   * default, this is a list of [`QuerySuggestion`](./x-components.query-suggestion.md) components.
   *
   * This component inherits `BaseSuggestions` component attributes.
   * Check [`BaseSuggestions` Props section](./x-components.base-suggestions.md#Props) and
   * [Slot section](./x-components.base-suggestions.md#Slots)
   * for further information.
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
type “sandal”. If you click on a suggestion, the search term in the search input is updated and the
query suggestions are changed to reflect the new search term.

_Type “sandal” or another fashion term in the input field to try it out!_

```vue live
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

_Type “lipstick” or another fashion term in the input field to try it out!_

```vue live
<template>
  <div>
    <SearchInput />
    <QuerySuggestions :animation="'StaggeredFadeAndSlide'" />
  </div>
</template>

<script>
  import Vue from 'vue';
  import { QuerySuggestions } from '@empathyco/x-components/query-suggestions';
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { StaggeredFadeAndSlide } from '@empathyco/x-components';

  // Registering the animation as a global component
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

_Type “bag” or another fashion term in the input field to try it out!_

```vue live
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

```vue live
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

_Type “trousers” or another toy in the input field to try it out!_

```vue live
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

_Type “pants” or another toy in the input field to try it out!_

```vue live
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
