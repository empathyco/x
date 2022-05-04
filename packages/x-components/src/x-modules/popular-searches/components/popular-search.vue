<template>
  <BaseSuggestion
    class="x-popular-search"
    :suggestion="suggestion"
    :suggestionSelectedEvents="events"
    data-test="popular-search"
    feature="popular_search"
  >
    <template #default="{ suggestion, filter }">
      <!--
        @slot Popular Search's content
            @binding {Suggestion} suggestion - Popular Search suggestion data
      -->

      <slot :suggestion="suggestion" :filter="filter">{{ suggestion.query }</slot>
    </template>
  </BaseSuggestion>
</template>

<script lang="ts">
  import { Suggestion } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import BaseSuggestion from '../../../components/suggestions/base-suggestion.vue';
  import { xComponentMixin } from '../../../components';
  import { XEventsTypes } from '../../../wiring';
  import { popularSearchesXModule } from '../x-module';

  /**
   * Renders a popular search item which receives the suggestion that will be rendered as a prop. It
   * exposes a default slot to change the popular search content. If the slot is not overridden,
   * it will render the suggestion query by default.
   *
   * @public
   */
  @Component({
    components: { BaseSuggestion },
    mixins: [xComponentMixin(popularSearchesXModule)]
  })
  export default class PopularSearch extends Vue {
    /**
     * The suggestion to render and use in the default slot.
     *
     * @public
     */
    @Prop({ required: true })
    protected suggestion!: Suggestion;

    /**
     * Events list which are going to be emitted when a popular search is selected.
     *
     * @returns The {@link XEvent | XEvents} to emit.
     * @public
     */
    protected get events(): Partial<XEventsTypes> {
      return {
        UserSelectedAPopularSearch: this.suggestion
      };
    }
  }
</script>

<docs lang="mdx">
## Examples

This components expects just a suggestion as a prop to be rendered. It has a slot to override the
content. By default, it renders the suggestion query of the popular search.

### Basic Usage

```vue live
<template>
  <PopularSearch :suggestion="suggestion" />
</template>

<script>
  import { PopularSearch } from '@empathyco/x-components/popular-searches';
  export default {
    name: 'PopularSearchDemo',
    components: {
      PopularSearch
    },
    data() {
      return {
        suggestion: {
          modelName: 'PopularSearch',
          query: 'tshirt',
          facets: []
        }
      };
    }
  };
</script>
```

### Custom Usage

```vue live
<template>
  <PopularSearch :suggestion="suggestion">
    <template #default="{ suggestion }">
      <TrendingIcon />
      <span :aria-label="suggestion.query">{{ suggestion.query }}</span>
    </template>
  </PopularSearch>
</template>

<script>
  import { PopularSearch } from '@empathyco/x-components/popular-searches';
  import { TrendingIcon } from '@empathyco/x-components';

  export default {
    name: 'PopularSearchDemo',
    components: {
      PopularSearch,
      TrendingIcon
    },
    data() {
      return {
        suggestion: {
          modelName: 'PopularSearch',
          query: 'tshirt',
          facets: []
        }
      };
    }
  };
</script>
```

## Events

A list of events that the component will emit:

- `UserSelectedAPopularSearch`: the event is emitted after the user clicks the button. The event
  payload is the popular search data.
</docs>
