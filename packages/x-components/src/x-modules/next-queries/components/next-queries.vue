<template>
  <BaseSuggestions :suggestions="nextQueries" data-test="next-queries" class="x-next-queries">
    <template #default="{suggestion}">
      <!-- @slot Slot for an individual Next Query item. -->
      <!-- @binding {Suggestion} suggestion - The data of the Next Query suggestion. -->
      <slot name="suggestion" :suggestion="suggestion">
        <NextQuery :suggestion="suggestion" class="x-next-queries__suggestion">
          <template #default="{ suggestion }">
            <!-- @slot Slot for the Next Query's content. -->
            <!-- @binding {Suggestion} suggestion - The data of the Next Query suggestion. -->
            <slot name="suggestion-content" :suggestion="suggestion" />
          </template>
        </NextQuery>
      </slot>
    </template>
  </BaseSuggestions>
</template>

<script lang="ts">
  import { NextQuery as NextQueryModel }from '@empathy/search-types';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BaseSuggestions from '../../../components/base-suggestions.vue';
  import { Getter } from '../../../components/decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { nextQueriesXModule } from '../x-module';
  import NextQuery from './next-query.vue';

  /**
   * Simple next-queries component that renders a list of suggestions, allowing the user to
   * select one of them, and emitting the needed events.
   * A next query is a suggestion for a new search, related to your previous query. I.e. If
   * people normally search for `shirts`, and then `trousers`, `trousers` would be a next query
   * of `shirts`.
   *
   * @public
   */
  @Component({
    components: { NextQuery, BaseSuggestions },
    mixins: [xComponentMixin(nextQueriesXModule)]
  })
  export default class NextQueries extends Vue {
    @Getter('nextQueries','nextQueries')
    public nextQueries!: NextQueryModel[];
  }
</script>

<docs>
  #Examples

  ## Basic example

  You don't need to pass any props, or slots. Simply add the component, and when it has any next
  queries it will show them

  ```vue
  <NextQueries />
  ```

  ## Overriding Next Queries' Content

  You can use your custom implementation of the Next Query's content.
  In the example below, instead of using the default Next Query's content, an icon
  is added, as well as a span with the query of the Next Query suggestion.

  ```vue
  <NextQueries>
    <template #suggestion-content="{suggestion}">
      <img src="./next-query-icon.svg" class="x-next-query__icon"/>
      <span class="x-next-query__query">{{ suggestion.query }}</span>
    </template>
  </NextQueries>
  ```

  ## Adding a custom next query component

  You can use your custom implementation of a next query component. To work correctly, it should
  use the `emitNextQuerySelected` function when the next query is selected.
  In the example below, instead of using the default `button` tag for a next query, an icon is
  added, and the text of the next query is wrapped in a `span`
  ```vue
  <NextQueries>
    <template #suggestion="{suggestion}">
      <NextQuery :suggestion="suggestion" class="x-next-queries__suggestion">
        <template #default="{suggestion}">
          <img src="./next-query-icon.svg" class="x-next-query__icon"/>
          <span class="x-next-query__query">{{ suggestion.query }}</span>
        </template>
      </NextQuery>
      <button>Custom Behaviour</button>
    </template>
  </NextQueries>
  ```
</docs>
